import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const targetHost = import.meta.env.VITE_BASE_WEB_HOST
if (targetHost && window.location.hostname !== targetHost) {
  window.location.replace(
    `https://${targetHost}${window.location.pathname}${window.location.search}${window.location.hash}`
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
