import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { Demo } from './demo/Demo'

const isDemo = new URLSearchParams(window.location.search).has('demo');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isDemo ? <Demo /> : <App />}
  </StrictMode>,
)
