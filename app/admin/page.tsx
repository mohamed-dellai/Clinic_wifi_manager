import Link from 'next/link'
import AppLayout from '@/components/AppLayout'
import MaintenanceWorkerWrapper from '@/components/MaintenanceWorkerWrapper'
import { TypographyH1, TypographySmall, TypographyLead } from '@/components/ui/typography'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Wifi, List, ArrowRight, BarChart } from 'lucide-react'

export default async function AdminPage(){
  return (
    <AppLayout requiredRole="ADMIN">
      <MaintenanceWorkerWrapper />
      
      <div className="p-8">
        <div className="mb-8">
          <TypographyH1>Tableau de bord administrateur</TypographyH1>
          <TypographyLead>Gérez les utilisateurs, points d'accès et sessions WiFi</TypographyLead>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Users Card */}
          <Link href="/admin/users" className="block group">
            <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer hover:border-primary/50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">Utilisateurs</CardTitle>
                    <CardDescription>Gérer administrateurs et secrétaires</CardDescription>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TypographySmall className="text-muted-fg mb-4">
                  Créer, modifier et supprimer les utilisateurs du système
                </TypographySmall>
                <div className="flex items-center text-sm font-medium text-primary mt-4">
                  <span>Accéder</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Statistics Card */}
          <Link href="/admin/statistic-secretaire" className="block group">
            <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer hover:border-primary/50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">Statistiques secrétaires</CardTitle>
                    <CardDescription>Tableau de bord des indicateurs clés du secrétariat</CardDescription>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <BarChart className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TypographySmall className="text-muted-fg mb-4">
                  Visualisez l'activité et les tendances par secrétariat
                </TypographySmall>
                <div className="flex items-center text-sm font-medium text-primary mt-4">
                  <span>Accéder</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* SSIDs Card */}
          <Link href="/admin/ssids" className="block group">
            <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer hover:border-primary/50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">Points d'accès WiFi</CardTitle>
                    <CardDescription>Gérer les SSIDs</CardDescription>
                  </div>
                  <div className="p-2 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
                    <Wifi className="w-5 h-5 text-secondary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TypographySmall className="text-muted-fg mb-4">
                  Créer et supprimer des points d'accès WiFi
                </TypographySmall>
                <div className="flex items-center text-sm font-medium text-primary mt-4">
                  <span>Accéder</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Sessions Card */}
          <Link href="/admin/sessions" className="block group">
            <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer hover:border-primary/50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">Sessions WiFi</CardTitle>
                    <CardDescription>Gérer toutes les sessions</CardDescription>
                  </div>
                  <div className="p-2 bg-cyan-100 rounded-lg group-hover:bg-cyan-200 transition-colors">
                    <List className="w-5 h-5 text-accent" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TypographySmall className="text-muted-fg mb-4">
                  Créer, modifier et supprimer des sessions WiFi
                </TypographySmall>
                <div className="flex items-center text-sm font-medium text-primary mt-4">
                  <span>Accéder</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}