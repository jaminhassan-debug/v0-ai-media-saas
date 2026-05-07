'use client'

import { UIMessage } from 'ai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SendIcon, StopCircleIcon } from 'lucide-react'
import { Message } from './message'
import { useEffect, useRef } from 'react'

interface ChatInterfaceProps {
  messages: UIMessage[]
  input: string
  setInput: (input: string) => void
  onSubmit: (message: string) => void
  isLoading: boolean
  onStop: () => void
}

export function ChatInterface({
  messages,
  input,
  setInput,
  onSubmit,
  isLoading,
  onStop,
}: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSubmit(input)
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-serif font-semibold text-foreground">
            Research Assistant
          </h1>
          <p className="text-sm text-foreground/60">
            Ask questions about our latest articles and insights
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-64 text-center">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-3">
                  Welcome to Your Research Assistant
                </h2>
                <p className="text-foreground/60 max-w-md">
                  Ask questions about intellectual property law, patents, trademarks,
                  family wealth strategies, or any topic covered in our publications.
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <Card className="bg-primary/5 border-primary/20 px-4 py-3 rounded-lg">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </Card>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border/40 bg-background/50 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={isLoading}
              className="flex-1 rounded-lg"
            />
            {isLoading ? (
              <Button
                type="button"
                onClick={onStop}
                variant="destructive"
                size="icon"
                className="rounded-lg"
              >
                <StopCircleIcon className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!input.trim()}
                size="icon"
                className="rounded-lg"
              >
                <SendIcon className="w-4 h-4" />
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
