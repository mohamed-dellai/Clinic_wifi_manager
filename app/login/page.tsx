import AuthCard from '../../components/AuthCard'
import LoginForm from '../../components/LoginForm'

export const metadata = {
  title: 'Sign in — Clinic',
}

export default function LoginPage(){
  return (
    <main className="page-center">
      <AuthCard title="Clinique" subtitle="Connectez-vous pour gérer les patients et l’accès Wi-Fi">
        <LoginForm />
      </AuthCard>
    </main>
  )
}
