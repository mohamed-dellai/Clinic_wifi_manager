"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { TypographySmall } from '@/components/ui/typography'
import { 
  Home, 
  Users, 
  Wifi, 
  LogOut, 
  LayoutDashboard,
  Plus,
  List
} from 'lucide-react'
import logo from '@/public/logo.png'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

interface AppSidebarProps {
  role: 'ADMIN' | 'SECRETARY'
}

export default function AppSidebar({ role }: AppSidebarProps) {
  const pathname = usePathname()

  const adminNav: NavItem[] = [
    { href: '/admin', label: 'Tableau de bord', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/admin/users', label: 'Utilisateurs', icon: <Users className="w-5 h-5" /> },
    { href: '/admin/ssids', label: 'Points d\'accès', icon: <Wifi className="w-5 h-5" /> },
    { href: '/admin/sessions', label: 'Sessions', icon: <List className="w-5 h-5" /> },
  ]

  const secretaryNav: NavItem[] = [
    { href: '/secretary', label: 'Tableau de bord', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/secretary/create', label: 'Nouvelle session', icon: <Plus className="w-5 h-5" /> },
    { href: '/secretary/sessions', label: 'Vos sessions', icon: <List className="w-5 h-5" /> },
  ]

  const navItems = role === 'ADMIN' ? adminNav : secretaryNav

  return (
    <aside className="w-64 bg-surface border-r border-border h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <Link href={role === 'ADMIN' ? '/admin' : '/secretary'} className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center flex-shrink-0">
            <img src={logo.src} alt="logo" className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm leading-tight text-primary">Clinic</div>
            <TypographySmall className="text-muted-fg truncate">WiFi Manager</TypographySmall>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex gap-3 items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-slate-700 hover:bg-bg-light'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <form action="/api/auth/logout" method="post" className="w-full">
          <Button 
            type="submit" 
            variant="ghost" 
            className="w-full justify-start gap-2 text-slate-700 hover:bg-red-50 hover:text-danger"
          >
            <LogOut className="w-5 h-5" />
            <span>Se déconnecter</span>
          </Button>
        </form>
      </div>
    </aside>
  )
}
