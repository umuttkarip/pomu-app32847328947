import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { Demo } from './demo/Demo'
import { PhoneFrame } from './PhoneFrame'

const isDemo = new URLSearchParams(window.location.search).has('demo');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PhoneFrame>
      {isDemo ? <Demo /> : <App />}
    </PhoneFrame>
  </StrictMode>,
)
