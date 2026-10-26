'use client'
import { useRouter } from 'next/navigation'

export function SearchBox() {
  const router = useRouter()
  return (
    <form
      className="searchbox"
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        const q = String(new FormData(e.currentTarget).get('q') ?? '').trim()
        if (q) router.push(`/search/?q=${encodeURIComponent(q)}`)
      }}
    >
      <label className="skip" htmlFor="site-q">Search</label>
      <input id="site-q" name="q" type="search" placeholder="Search FWI" />
      <button className="btn small" type="submit">Search</button>
    </form>
  )
}
