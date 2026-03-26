export function TypographyH1({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h1 className={`text-h1 ${className}`}>{children}</h1>
}

export function TypographyH2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`text-h2 ${className}`}>{children}</h2>
}

export function TypographyH3({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-h3 ${className}`}>{children}</h3>
}

export function TypographyH4({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h4 className={`text-h4 ${className}`}>{children}</h4>
}

export function TypographyP({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-body ${className}`}>{children}</p>
}

export function TypographySmall({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-body-sm ${className}`}>{children}</p>
}

export function TypographyMuted({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-body-sm text-muted-fg ${className}`}>{children}</p>
}

export function TypographyLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-label ${className}`}>{children}</label>
}
