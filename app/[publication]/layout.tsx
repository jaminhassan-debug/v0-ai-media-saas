import { notFound } from 'next/navigation'
import { getPublicationBySlug, getCategories, getCurrentProfile } from '@/lib/data'
import { PublicationHeader } from '@/components/publication/header'
import { PublicationFooter } from '@/components/publication/footer'

interface PublicationLayoutProps {
  children: React.ReactNode
  params: Promise<{ publication: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ publication: string }> }) {
  const { publication: slug } = await params
  const publication = await getPublicationBySlug(slug)
  
  if (!publication) {
    return { title: 'Publication Not Found' }
  }

  return {
    title: {
      default: publication.name,
      template: `%s | ${publication.name}`,
    },
    description: publication.description || publication.tagline,
  }
}

export default async function PublicationLayout({ children, params }: PublicationLayoutProps) {
  const { publication: slug } = await params
  const [publication, categories, user] = await Promise.all([
    getPublicationBySlug(slug),
    getCategories(slug),
    getCurrentProfile(),
  ])

  if (!publication) {
    notFound()
  }

  // Determine theme class based on publication slug
  const themeClass = slug === 'ip-law' ? 'theme-ip-law' : slug === 'family-wealth' ? 'theme-family-wealth' : ''

  return (
    <div className={`min-h-screen flex flex-col ${themeClass}`}>
      <PublicationHeader 
        publication={publication} 
        categories={categories} 
        user={user}
      />
      <main className="flex-1">
        {children}
      </main>
      <PublicationFooter 
        publication={publication} 
        categories={categories} 
      />
    </div>
  )
}
