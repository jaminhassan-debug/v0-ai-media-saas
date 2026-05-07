'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOutIcon, BookOpenIcon, MessageSquareIcon } from 'lucide-react'
import Link from 'next/link'

interface Profile {
  full_name: string | null
  email: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profileData)
      setLoading(false)
    }

    loadProfile()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground/60">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/50 backdrop-blur-sm sticky top-0">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-sm text-foreground/60">
              Welcome back, {profile?.full_name || profile?.email}
            </p>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="rounded-lg"
          >
            <LogOutIcon className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Publications */}
          <Card className="p-6">
            <div className="flex gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpenIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-semibold text-foreground">
                  Publications
                </h2>
                <p className="text-sm text-foreground/60">
                  Explore expert insights
                </p>
              </div>
            </div>
            <p className="text-foreground/70 mb-4">
              Browse our comprehensive collection of articles on IP law and
              family wealth management.
            </p>
            <div className="space-y-2">
              <Link href="/ip-law">
                <Button variant="outline" className="w-full justify-start rounded-lg">
                  IP Law Intelligence
                </Button>
              </Link>
              <Link href="/family-wealth">
                <Button variant="outline" className="w-full justify-start rounded-lg">
                  Family Wealth Intelligence
                </Button>
              </Link>
            </div>
          </Card>

          {/* Research Assistant */}
          <Card className="p-6">
            <div className="flex gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquareIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-semibold text-foreground">
                  Research Assistant
                </h2>
                <p className="text-sm text-foreground/60">
                  AI-powered insights
                </p>
              </div>
            </div>
            <p className="text-foreground/70 mb-4">
              Ask questions about our content and get instant, expert-level
              analysis powered by AI.
            </p>
            <div className="space-y-2">
              <Link href="/ip-law/chat">
                <Button className="w-full justify-start rounded-lg">
                  Chat with IP Law Assistant
                </Button>
              </Link>
              <Link href="/family-wealth/chat">
                <Button className="w-full justify-start rounded-lg">
                  Chat with Wealth Assistant
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Account Info */}
        <Card className="p-6">
          <h2 className="text-xl font-serif font-semibold text-foreground mb-4">
            Account Information
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-foreground/60">Full Name</p>
              <p className="font-medium text-foreground">
                {profile?.full_name || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Email</p>
              <p className="font-medium text-foreground">{profile?.email}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
