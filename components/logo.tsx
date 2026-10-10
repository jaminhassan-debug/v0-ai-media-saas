export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="Family Wealth Intelligence">
      <rect width="40" height="40" fill="#0b1f3a" />
      <path d="M12 9h17v5H18v5h9v5h-9v8h-6z" fill="#fff" />
      <path d="M40 28v12H28z" fill="#a8761b" />
    </svg>
  )
}
