import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import { MarketList } from './pages/MarketList'
import { MarketMap } from './pages/MarketMap'
import { MarketCalendar } from './pages/MarketCalendar'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <MarketMap />
      },
      {
        path: '/calendar',
        element: <MarketCalendar />
      },
      {
        path: '/markets',
        element: <MarketList />
      }
    ]
  }
])