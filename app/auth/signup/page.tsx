'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

function SignUpContent() {
  const router = useRouter()
  const { useSearchParams } = require('next/navigation')
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const next = searchParams.get('next') || '/dashboard'

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const supabase = createClient()

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      setMessage(
        'Confirmation email sent! Check your inbox to verify your account.'
      )
      setEmail('')
      setPassword('')
      setFullName('')

      // Redirect after a delay
      setTimeout(() => {
        router.push(`/auth/signup-success`)
      }, 3000)
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('[v0] Sign up error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
            Create Account
          </h1>
          <p className="text-foreground/60 mb-6">
            Join our community of legal and wealth professionals
          </p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">{error}</p>
              </div>
            </div>
          )}

          {message && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-primary">{message}</p>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <p className="text-xs text-foreground/50 mt-1">
                At least 8 characters recommended
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-foreground/60 mb-4">
              Already have an account?{' '}
              <Link
                href={`/auth/login?next=${encodeURIComponent(next)}`}
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div />}>
      <SignUpContent />
    </Suspense>
  )
}
