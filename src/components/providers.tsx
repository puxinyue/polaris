'use client'

import { ReactNode } from 'react'
import { Authenticated, AuthLoading, ConvexReactClient, Unauthenticated } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { ThemeProvider } from './theme-provider'
import { UserButton } from '@clerk/nextjs'
import { UnauthenticatedView } from './features/auth/components/unauthenticated-view'
import { AuthLoadingView } from './features/auth/components/auth-loading-view'
import { dark } from '@clerk/themes'

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
        appearance={{
            theme: dark,
        }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider
            attribute="class"
            forcedTheme="dark"
            enableSystem
            disableTransitionOnChange
            >
           <Authenticated>
             <UserButton />
             {children}
           </Authenticated>
           <Unauthenticated>
            <UnauthenticatedView />
           </Unauthenticated>
           <AuthLoading>
              <AuthLoadingView />
           </AuthLoading>
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}