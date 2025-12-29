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

    // Force reposition Tag Assistant when tab changes
    setTimeout(() => {
      const repositionTagAssistant = () => {
        const selectors = [
          '.badge.badge-iframe',
          '.badge-iframe',
          '[class*="badge"]',
        ]

        selectors.forEach((selector) => {
          const elements = document.querySelectorAll(selector)
          elements.forEach((element) => {
            const el = element as HTMLElement
            if (el.textContent?.includes('Tag Assistant')) {
              el.style.position = 'fixed'
              el.style.bottom = '20px'
              el.style.right = '20px'
              el.style.top = 'auto'
              el.style.left = 'auto'
              el.style.transform = 'none'
              el.style.margin = '0'
              el.style.zIndex = '999999'
            }
          })
        })
      }
      repositionTagAssistant()
    }, 100)
  }, [activeTab])

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
      {activeTab === 'csp' && (
        <div style={{ position: 'relative', isolation: 'isolate' }}>
          <CSPWhitelistManager />
        </div>
      )}
    </div>
  )
}

export default App
