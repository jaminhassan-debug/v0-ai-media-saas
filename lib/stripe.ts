import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acpi',
})

export interface Product {
  id: string
  name: string
  description: string
  priceMonthlyInCents: number
  priceYearlyInCents: number
  features: string[]
}

export const SUBSCRIPTION_TIERS: Product[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with essential features',
    priceMonthlyInCents: 0,
    priceYearlyInCents: 0,
    features: [
      '5 articles per month',
      'Basic search',
      'Email newsletter',
      'Community access',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For serious researchers and practitioners',
    priceMonthlyInCents: 2900,
    priceYearlyInCents: 29000,
    features: [
      'Unlimited articles',
      'AI Research Assistant',
      'Advanced search & filters',
      'Downloadable reports',
      'Priority support',
      'API access',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For teams and organizations',
    priceMonthlyInCents: 9900,
    priceYearlyInCents: 99000,
    features: [
      'Everything in Professional',
      'Team access (up to 10 users)',
      'Custom integrations',
      'Dedicated account manager',
      'Advanced analytics',
      'SLA support',
    ],
  },
]

export function getProductById(id: string): Product | undefined {
  return SUBSCRIPTION_TIERS.find((tier) => tier.id === id)
}

export function getPriceInCents(
  productId: string,
  billingPeriod: 'monthly' | 'yearly'
): number {
  const product = getProductById(productId)
  if (!product) return 0

  return billingPeriod === 'monthly'
    ? product.priceMonthlyInCents
    : product.priceYearlyInCents
}
