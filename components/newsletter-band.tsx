import { NewsletterForm } from './newsletter-form'

export function NewsletterBand({ source = 'band' }: { source?: string }) {
  return (
    <section className="news-band">
      <div className="wrap">
        <h2>The week in family wealth, every Friday</h2>
        <p>Regulation, deals, people moves and the best analysis from the UK, Europe, US and Asia. Free.</p>
        <NewsletterForm source={source} />
      </div>
    </section>
  )
}
