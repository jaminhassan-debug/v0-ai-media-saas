'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircleIcon } from 'lucide-react'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8 text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />

          <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
            Verification Email Sent
          </h1>
          <p className="text-foreground/60 mb-6">
            Please check your email to verify your account and start using our
            research assistant.
          </p>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-foreground/70">
              Didn&apos;t receive the email? Check your spam folder or{' '}
              <button className="text-primary font-medium hover:text-primary/80">
                resend the verification link
              </button>
            </p>
          </div>

          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full rounded-lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
