import { streamText, convertToModelMessages } from 'ai'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { messages, publicationId } = await req.json()

    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Fetch relevant articles for context
    const { data: articles } = await supabase
      .from('articles')
      .select('id, title, content, category_id')
      .eq('publication_id', publicationId)
      .eq('status', 'published')
      .limit(10)

    const articleContext = articles
      ?.map(
        (article) =>
          `Title: ${article.title}\nContent: ${article.content?.substring(0, 500) || 'No content'}`
      )
      .join('\n\n')

    // Create system prompt with article context
    const systemPrompt = `You are an expert research assistant for a premium legal and wealth management publication. 
You have access to the latest articles and insights on intellectual property law and family wealth strategies.

${articleContext ? `Here are the most relevant articles for context:\n${articleContext}` : ''}

When answering questions:
1. Reference specific articles when relevant using their titles
2. Provide detailed, authoritative analysis
3. Suggest related articles the user might find valuable
4. Maintain a professional, expert tone
5. If you reference an article, format it as: "According to '[Article Title]'..."

Respond with thorough, nuanced answers that demonstrate deep expertise in your domain.`

    const result = await streamText({
      model: 'openai/gpt-4o-mini',
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      maxTokens: 2000,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('[v0] Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
