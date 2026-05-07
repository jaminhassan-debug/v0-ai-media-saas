'use client'

import { UIMessage } from 'ai'
import { Card } from '@/components/ui/card'
import { MessageCircleIcon, BotIcon } from 'lucide-react'

interface MessageProps {
  message: UIMessage
}

function getUIMessageText(msg: UIMessage): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return ''
  return msg.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

export function Message({ message }: MessageProps) {
  const isAssistant = message.role === 'assistant'
  const text = getUIMessageText(message)

  if (!text) return null

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <Card
        className={`max-w-2xl px-4 py-3 rounded-lg ${
          isAssistant
            ? 'bg-primary/5 border-primary/20 text-foreground'
            : 'bg-primary text-primary-foreground'
        }`}
      >
        <div className="flex gap-3">
          {isAssistant && (
            <BotIcon className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-60" />
          )}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
