import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Import your context provider
import { BookingProvider } from './context/BookingContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    {/* Wrap App so all pages can access booking data */}
    <BookingProvider>
      <App />
    </BookingProvider>

  </StrictMode>,
)
