import Link from 'next/link'
import AppLayout from '@/components/AppLayout'
import MaintenanceWorkerWrapper from '@/components/MaintenanceWorkerWrapper'
import { TypographyH1, TypographySmall, TypographyLead } from '@/components/ui/typography'
import BackToDashboardButton from '@/components/BackToDashboardButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, List, ArrowRight } from 'lucide-react'

export default async function SecretaryPage(){
  return (
    <AppLayout requiredRole="SECRETARY">
      <MaintenanceWorkerWrapper />
      
      <div className="p-8">
        <div className="mb-8" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
          <div>
            <TypographyH1>Tableau de bord</TypographyH1>
            <TypographyLead>Gérez vos sessions WiFi facilement</TypographyLead>
          </div>
          <div>
            <BackToDashboardButton />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          {/* Create Session Card */}
          <Link href="/secretary/create" className="block group">
            <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer hover:border-primary/50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">Nouvelle session</CardTitle>
                    <CardDescription>Créer une session WiFi</CardDescription>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <Plus className="w-5 h-5 text-success" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TypographySmall className="text-muted-fg mb-4 block">
                  Créez une nouvelle session WiFi pour les utilisateurs de la clinique
                </TypographySmall>
                <div className="flex items-center text-sm font-medium text-primary mt-4">
                  <span>Créer</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Sessions List Card */}
          <Link href="/secretary/sessions" className="block group">
            <Card className="hover:shadow-lg transition-shadow h-full cursor-pointer hover:border-primary/50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">Vos sessions</CardTitle>
                    <CardDescription>Consulter et gérer</CardDescription>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <List className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TypographySmall className="text-muted-fg mb-4 block">
                  Voir, modifier et supprimer vos sessions WiFi
                </TypographySmall>
                <div className="flex items-center text-sm font-medium text-primary mt-4">
                  <span>Consulter</span>
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
