import './globals.css'

export const metadata = {
  title: 'Clinic App',
  description: 'A minimal Next.js + Prisma starter',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
