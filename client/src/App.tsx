// src/App.tsx
import React from 'react'
import ContactForm from './ContactForm'
import CSPWhitelistManager from './CSPWhitelistManager'

// Functional Component for the App
const App: React.FC = () => {
  return (
    <div>
      {/* Main content with bottom padding for fixed CSP manager */}
      <div style={{ paddingBottom: '700px', minHeight: '100vh' }}>
        {/* Rendering the ContactForm component */}
        <ContactForm />
      </div>

      {/* CSP Whitelist Manager - Fixed at bottom */}
      <CSPWhitelistManager />
    </div>
  )
}

export default App
