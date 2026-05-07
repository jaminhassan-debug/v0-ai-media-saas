'use server'

import { stripe, SUBSCRIPTION_TIERS, getPriceInCents } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function createCheckoutSession(
  tierId: string,
  billingPeriod: 'monthly' | 'yearly',
  publicationId: string
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('User not authenticated')
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      throw new Error('Profile not found')
    }

    // Get or create Stripe customer
    let customerId = profile.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile.full_name || undefined,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id

      // Update profile with customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Get price from Stripe (or create if doesn't exist)
    const product = SUBSCRIPTION_TIERS.find((t) => t.id === tierId)
    if (!product) {
      throw new Error('Invalid subscription tier')
    }

    const priceInCents = getPriceInCents(tierId, billingPeriod)

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: priceInCents,
            recurring:
              priceInCents > 0
                ? {
                    interval: billingPeriod === 'monthly' ? 'month' : 'year',
                    interval_count: 1,
                  }
                : undefined,
          },
          quantity: 1,
        },
      ],
      mode: priceInCents > 0 ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${publicationId}/pricing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${publicationId}/pricing`,
      metadata: {
        userId: user.id,
        tierId,
        publicationId,
      },
    })

    return { sessionId: session.id }
  } catch (error) {
    console.error('[v0] Checkout session error:', error)
    throw error
  }
}

export async function getSubscriptionStatus(publicationId: string) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(cookieStore)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    // Get user's subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('publication_id', publicationId)
      .maybeSingle()

    return subscription || null
  } catch (error) {
    console.error('[v0] Get subscription status error:', error)
    return null
  }
}
