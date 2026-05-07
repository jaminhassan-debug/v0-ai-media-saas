'use client'

import { SUBSCRIPTION_TIERS } from '@/lib/stripe'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckIcon, AlertCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { createCheckoutSession } from '@/app/actions/stripe'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'

export default function PricingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const publication = params.publication as string
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>(
    'monthly'
  )
  const [loadingTier, setLoadingTier] = useState<string | null>(null)
  const [error, setError] = useState('')
  const success = searchParams.get('success') === 'true'

  const handleSelectTier = async (tierId: string) => {
    if (tierId === 'free') {
      // Free tier - just close the dialog or redirect
      return
    }

    setLoadingTier(tierId)
    setError('')

    try {
      const result = await createCheckoutSession(
        tierId,
        billingPeriod,
        publication
      )

      if (result.sessionId) {
        // Redirect to Stripe checkout endpoint
        window.location.href = `https://checkout.stripe.com/pay/${result.sessionId}`
      }
    } catch (err) {
      setError('Failed to start checkout. Please try again.')
      console.error('[v0] Checkout error:', err)
    } finally {
      setLoadingTier(null)
    }
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-foreground/60 mb-8">
            Choose the plan that fits your research needs
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-border text-foreground hover:bg-border/80'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                billingPeriod === 'yearly'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-border text-foreground hover:bg-border/80'
              }`}
            >
              Yearly <span className="ml-2 text-xs">Save 17%</span>
            </button>
          </div>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex gap-3">
            <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">
                Welcome! Your subscription is active.
              </p>
              <p className="text-sm text-green-700">
                You can now access premium features.
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-8 flex gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">{error}</p>
            </div>
          </div>
        )}

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {SUBSCRIPTION_TIERS.map((tier) => (
            <Card
              key={tier.id}
              className={`flex flex-col p-6 ${
                tier.id === 'professional' ? 'md:scale-105 md:shadow-xl' : ''
              }`}
            >
              <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
                {tier.name}
              </h3>
              <p className="text-foreground/60 text-sm mb-6">
                {tier.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                {tier.id === 'free' ? (
                  <p className="text-3xl font-bold text-foreground">Free</p>
                ) : (
                  <div>
                    <span className="text-4xl font-bold text-foreground">
                      $
                      {(
                        (billingPeriod === 'monthly'
                          ? tier.priceMonthlyInCents
                          : tier.priceYearlyInCents) / 100
                      ).toFixed(0)}
                    </span>
                    <span className="text-foreground/60 ml-2">
                      /{billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              {tier.id === 'free' ? (
                <Link href={`/${publication}`}>
                  <Button variant="outline" className="w-full rounded-lg mb-6">
                    Get Started
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={() => handleSelectTier(tier.id)}
                  disabled={loadingTier === tier.id}
                  className="w-full rounded-lg mb-6"
                >
                  {loadingTier === tier.id && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {loadingTier === tier.id ? 'Processing...' : 'Subscribe'}
                </Button>
              )}

              {/* Features */}
              <div className="space-y-3">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex gap-3">
                    <CheckIcon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ or additional info */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="text-left">
              <h4 className="font-semibold text-foreground mb-2">
                Can I change my plan?
              </h4>
              <p className="text-foreground/60 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect on your next billing cycle.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-foreground mb-2">
                Is there a trial?
              </h4>
              <p className="text-foreground/60 text-sm">
                Start with our Free plan to explore the platform. Upgrade anytime
                to access premium features.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-foreground mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-foreground/60 text-sm">
                We accept all major credit cards, debit cards, and bank transfers
                through Stripe.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-foreground mb-2">
                Can I cancel anytime?
              </h4>
              <p className="text-foreground/60 text-sm">
                Yes, cancel your subscription anytime from your account settings.
                No questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
