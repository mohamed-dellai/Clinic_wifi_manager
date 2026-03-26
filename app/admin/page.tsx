import Link from 'next/link'
import AppLayout from '@/components/AppLayout'
import MaintenanceWorkerWrapper from '@/components/MaintenanceWorkerWrapper'
import { TypographyH1, TypographySmall } from '@/components/ui/typography'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Wifi, List, ArrowRight } from 'lucide-react'

export default async function AdminPage(){
  return (
    <AppLayout requiredRole="ADMIN">
      <MaintenanceWorkerWrapper />
      
      <div className="p-8">
        <div className="mb-8">
          <TypographyH1>Tableau de bord administrateur</TypographyH1>
          <TypographySmall className="text-muted-fg mt-2">Gérez les utilisateurs, points d'accès et sessions WiFi</TypographySmall>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Users Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">Utilisateurs</CardTitle>
                  <CardDescription>Gérer administrateurs et secrétaires</CardDescription>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TypographySmall className="text-muted-fg mb-4">
                Créer, modifier et supprimer les utilisateurs du système
              </TypographySmall>
              <Link href="/admin/users">
                <Button variant="default" className="w-full justify-between group">
                  <span>Accéder</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* SSIDs Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">Points d'accès WiFi</CardTitle>
                  <CardDescription>Gérer les SSIDs</CardDescription>
                </div>
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Wifi className="w-5 h-5 text-secondary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TypographySmall className="text-muted-fg mb-4">
                Créer et supprimer des points d'accès WiFi
              </TypographySmall>
              <Link href="/admin/ssids">
                <Button variant="default" className="w-full justify-between group">
                  <span>Accéder</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Sessions Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">Sessions WiFi</CardTitle>
                  <CardDescription>Gérer toutes les sessions</CardDescription>
                </div>
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <List className="w-5 h-5 text-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TypographySmall className="text-muted-fg mb-4">
                Créer, modifier et supprimer des sessions WiFi
              </TypographySmall>
              <Link href="/admin/sessions">
                <Button variant="default" className="w-full justify-between group">
                  <span>Accéder</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}