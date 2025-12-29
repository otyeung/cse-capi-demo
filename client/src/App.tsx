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

  // Reposition Tag Assistant on mount and continuously
  useEffect(() => {
    const repositionTagAssistant = () => {
      // Target Chrome extension popups and overlays that are direct children of body
      const bodyChildren = Array.from(document.body.children) as HTMLElement[]

      bodyChildren.forEach((el) => {
        const style = window.getComputedStyle(el)
        const hasHighZIndex = parseInt(style.zIndex || '0') > 999
        const isPositioned =
          style.position === 'absolute' || style.position === 'fixed'

        // Check if element or its children contain "Tag Assistant"
        const hasTagAssistant =
          el.textContent?.includes('Tag Assistant') ||
          el.innerHTML?.includes('Tag Assistant') ||
          el.querySelector('[class*="tag"]') ||
          el.querySelector('[class*="Tag"]') ||
          el.id?.includes('tag') ||
          el.className?.includes('badge')

        if ((hasHighZIndex && isPositioned) || hasTagAssistant) {
          el.style.setProperty('position', 'fixed', 'important')
          el.style.setProperty('bottom', '20px', 'important')
          el.style.setProperty('right', '20px', 'important')
          el.style.setProperty('top', 'auto', 'important')
          el.style.setProperty('left', 'auto', 'important')
          el.style.setProperty('transform', 'none', 'important')
          el.style.setProperty('margin', '0', 'important')
          el.style.setProperty('z-index', '999999', 'important')
        }
      })

      // Also check for specific selectors that might be Tag Assistant elements
      const selectors = [
        '.badge',
        '.badge-iframe',
        '[class*="badge"]',
        '[class*="tag-assistant"]',
        '[class*="TagAssistant"]',
        'div[style*="position: absolute"][style*="z-index"]',
        'div[style*="position: fixed"][style*="z-index"]',
      ]

      selectors.forEach((selector) => {
        try {
          const elements = document.querySelectorAll(selector)
          elements.forEach((element) => {
            const el = element as HTMLElement
            // Only reposition if it has high z-index (likely an overlay/popup)
            const zIndex = parseInt(window.getComputedStyle(el).zIndex || '0')
            if (zIndex > 999 || el.textContent?.includes('Tag Assistant')) {
              el.style.setProperty('position', 'fixed', 'important')
              el.style.setProperty('bottom', '20px', 'important')
              el.style.setProperty('right', '20px', 'important')
              el.style.setProperty('top', 'auto', 'important')
              el.style.setProperty('left', 'auto', 'important')
              el.style.setProperty('transform', 'none', 'important')
              el.style.setProperty('margin', '0', 'important')
              el.style.setProperty('z-index', '999999', 'important')
            }
          })
        } catch (e) {
          // Ignore selector errors
        }
      })
    }

    // Initial repositioning with staggered timing
    repositionTagAssistant()
    const timers = [50, 100, 250, 500, 750, 1000, 1500, 2000].map((delay) =>
      setTimeout(repositionTagAssistant, delay)
    )

    // Continuous monitoring - check more frequently initially
    const interval = setInterval(repositionTagAssistant, 500)

    // MutationObserver to catch DOM changes
    const observer = new MutationObserver((mutations) => {
      // Only reposition if we detect new nodes or style changes
      const shouldReposition = mutations.some(
        (mutation) =>
          (mutation.type === 'childList' && mutation.addedNodes.length > 0) ||
          mutation.type === 'attributes'
      )
      if (shouldReposition) {
        repositionTagAssistant()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
      clearInterval(interval)
      observer.disconnect()
    }
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
