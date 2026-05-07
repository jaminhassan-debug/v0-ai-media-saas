'use client'

import { useParams, useRouter } from 'next/navigation'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { ChatInterface } from '@/components/chat/chat-interface'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const publication = params.publication as string
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push(`/${publication}/signin?next=/chat`)
        return
      }

      setIsAuthenticated(true)
      setLoading(false)
    }

    checkAuth()
  }, [router, publication])

  const { messages, input, setInput, append, isLoading, stop } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      headers: {
        'Content-Type': 'application/json',
      },
    }),
    body: {
      publicationId: publication,
    },
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground/60">Loading chat...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <ChatInterface
      messages={messages}
      input={input}
      setInput={setInput}
      onSubmit={(message) => append({ role: 'user', content: message })}
      isLoading={isLoading}
      onStop={stop}
    />
  )
}
