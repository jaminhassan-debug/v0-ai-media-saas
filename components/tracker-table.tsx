import { fmtDate, type TrackerItem } from '@/lib/content'

export function TrackerTable({ items }: { items: TrackerItem[] }) {
  return (
    <div className="table-scroll">
      <table className="tbl">
        <thead><tr><th>Added</th><th>Region</th><th>Issuer</th><th>Item</th><th>Sector</th><th>Status</th><th>Closes</th></tr></thead>
        <tbody>
          {items.map((t) => (
            <tr key={t.id}>
              <td className="num">{fmtDate(t.date)}</td><td>{t.region}</td><td>{t.body}</td><td>{t.title}</td><td>{t.sector}</td>
              <td><span className={`pill ${t.status.toLowerCase().replace(' ', '-')}`}>{t.status}</span></td>
              <td className="num">{t.closes ? fmtDate(t.closes) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
