import { NextPage } from 'next'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import 'styles/global.css'

type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode
}

type CustomAppProps = AppProps & {
  Component: Page
}

const queryClient = new QueryClient()

export default function App({ Component, pageProps: { session, ...pageProps } }: CustomAppProps) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>{getLayout(<Component {...pageProps} />)}</SessionProvider>
      {/* loaded only in development by default */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
