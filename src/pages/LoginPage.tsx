import { LoginForm, GuestOnly } from '../components/auth'

export function LoginPage() {
  return (
    <GuestOnly>
      <LoginForm />
    </GuestOnly>
  )
}