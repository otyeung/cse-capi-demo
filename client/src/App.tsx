// src/App.tsx
import React, { useState, useEffect } from 'react'
import ContactForm from './ContactForm'
import CSPWhitelistManager from './CSPWhitelistManager'

// Functional Component for the App
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contact' | 'csp'>(() => {
    const saved = localStorage.getItem('activeTab')
    return saved === 'contact' || saved === 'csp' ? saved : 'contact'
  })

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab)
  }, [activeTab])

  // Simple, lightweight Tag Assistant repositioning
  useEffect(() => {
    // Inject CSS for positioning
    const styleId = 'tag-assistant-fix'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        body > div[style*="z-index"] {
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          top: auto !important;
          left: auto !important;
        }
      `
      document.head.appendChild(style)
    }

    // Lightweight repositioning - only check body children
    const reposition = () => {
      const bodyChildren = document.body.children
      for (let i = 0; i < bodyChildren.length; i++) {
        const el = bodyChildren[i] as HTMLElement
        const style = el.style.cssText || ''
        const computed = window.getComputedStyle(el)
        const zIndex = parseInt(computed.zIndex || '0')

        // Only target elements with very high z-index (Tag Assistant)
        if (zIndex > 999999) {
          el.style.setProperty('position', 'fixed', 'important')
          el.style.setProperty('bottom', '20px', 'important')
          el.style.setProperty('right', '20px', 'important')
          el.style.setProperty('top', 'auto', 'important')
          el.style.setProperty('left', 'auto', 'important')
        }
      }
    }

    // Run a few times on load
    setTimeout(reposition, 100)
    setTimeout(reposition, 500)
    setTimeout(reposition, 1500)

    // Then check periodically but infrequently
    const interval = setInterval(reposition, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Tab Navigation */}
      <div className='bg-white shadow-md border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex space-x-8'>
            <button
              onClick={() => setActiveTab('contact')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'contact'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contact Form
            </button>
            <button
              onClick={() => setActiveTab('csp')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'csp'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              LinkedIn CSP
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'contact' && (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <ContactForm />
        </div>
      )}
      {activeTab === 'csp' && <CSPWhitelistManager />}
    </div>
  )
}

export default App
