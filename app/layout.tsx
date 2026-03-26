import './globals.css'
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

export const metadata = {
  title: 'Clinic WiFi Manager',
  description: 'Professional clinic WiFi session management system',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-bg-light">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
