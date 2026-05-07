'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircleIcon } from 'lucide-react'
import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8 text-center">
          <AlertCircleIcon className="w-16 h-16 text-destructive mx-auto mb-4" />

          <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
            Authentication Error
          </h1>
          <p className="text-foreground/60 mb-6">
            Something went wrong during authentication. Please try again.
          </p>

          <Link href="/auth/login" className="w-full block">
            <Button className="w-full rounded-lg">Try Again</Button>
          </Link>

          <Link href="/" className="w-full block mt-3">
            <Button variant="outline" className="w-full rounded-lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
