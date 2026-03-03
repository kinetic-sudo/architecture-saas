import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'

export const links = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: { error: unknown }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
      <pre className="mt-2 text-sm">{String(error)}</pre>
    </div>
  )
}