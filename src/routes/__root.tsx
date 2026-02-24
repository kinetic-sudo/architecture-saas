import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'


import appCss from '../styles.css?url'
import Navbar from '../components/Navbar'
import { useState } from 'react'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

const DEFAULT_AUTH_STATE: AuthState = {
  isSignedIn: false,
  userName: null,
  userId: null

}

function RootDocument({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(DEFAULT_AUTH_STATE)

  const refreshAuth = () => {
    try {

    } catch {
      
    }
  }

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}


