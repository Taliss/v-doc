import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactNode } from 'react'
import 'styles/global.css'

type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode
}

type CustomAppProps = AppProps & {
  Component: Page
}

export default function App({ Component, pageProps }: CustomAppProps) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
