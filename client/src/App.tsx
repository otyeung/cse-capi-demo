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

  // ULTIMATE FIX: Force Tag Assistant to lower right corner
  useEffect(() => {
    // Inject aggressive CSS override
    const styleId = 'tag-assistant-position-override'
    let styleEl = document.getElementById(styleId) as HTMLStyleElement

    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = styleId
      styleEl.textContent = `
        /* Ultra-aggressive Tag Assistant positioning */
        body > div[style*="position"][style*="z-index"],
        body > div[style*="position: absolute"],
        body > div[style*="position: fixed"],
        .badge,
        .badge-iframe,
        [class*="badge"],
        [class*="tag-assistant"],
        [class*="TagAssistant"],
        div[style*="z-index: 2147483647"],
        div[style*="z-index: 999999"] {
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          top: auto !important;
          left: auto !important;
          transform: none !important;
          margin: 0 !important;
          z-index: 2147483647 !important;
        }
      `
      document.head.appendChild(styleEl)
    }

    // Super aggressive repositioning function
    const forceReposition = () => {
      // Method 1: Scan ALL elements and identify Tag Assistant by multiple criteria
      const allElements = document.querySelectorAll('*')

      allElements.forEach((element) => {
        const el = element as HTMLElement
        const computedStyle = window.getComputedStyle(el)
        const zIndex = parseInt(computedStyle.zIndex || '0')

        // Multiple detection criteria
        const isHighZIndex = zIndex > 999999 || zIndex === 2147483647
        const hasTagText =
          el.textContent?.includes('Tag Assistant') ||
          el.textContent?.includes('Tag Assistant Connected')
        const hasTagInHTML =
          el.innerHTML?.includes('tag-assistant') ||
          el.innerHTML?.includes('TagAssistant')
        const isBadge = el.className?.includes('badge')
        const hasTagId = el.id?.toLowerCase().includes('tag')
        const isDirectBodyChild = el.parentElement === document.body
        const isPositioned =
          computedStyle.position === 'fixed' ||
          computedStyle.position === 'absolute'

        if (
          (isHighZIndex && isPositioned) ||
          (hasTagText && isDirectBodyChild) ||
          (hasTagInHTML && isPositioned) ||
          (isBadge && zIndex > 100)
        ) {
          // Nuclear option: Remove all positioning and re-apply
          el.style.cssText = ''

          // Apply with maximum priority
          const styles = {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            top: 'auto',
            left: 'auto',
            transform: 'none',
            margin: '0',
            'z-index': '2147483647',
          }

          Object.entries(styles).forEach(([prop, value]) => {
            el.style.setProperty(prop, value, 'important')
          })

          // Also set as direct style attribute for extra insurance
          el.setAttribute(
            'style',
            `position: fixed !important;
             bottom: 20px !important;
             right: 20px !important;
             top: auto !important;
             left: auto !important;
             transform: none !important;
             margin: 0 !important;
             z-index: 2147483647 !important;`
          )
        }
      })

      // Method 2: Direct body children with high z-index
      Array.from(document.body.children).forEach((child) => {
        const el = child as HTMLElement
        const zIndex = parseInt(window.getComputedStyle(el).zIndex || '0')

        if (zIndex > 900000) {
          el.style.setProperty('position', 'fixed', 'important')
          el.style.setProperty('bottom', '20px', 'important')
          el.style.setProperty('right', '20px', 'important')
          el.style.setProperty('top', 'auto', 'important')
          el.style.setProperty('left', 'auto', 'important')
          el.style.setProperty('transform', 'none', 'important')
        }
      })
    }

    // Immediate execution
    forceReposition()

    // Use requestAnimationFrame for smoother updates
    let rafId: number
    const rafLoop = () => {
      forceReposition()
      rafId = requestAnimationFrame(rafLoop)
    }
    rafId = requestAnimationFrame(rafLoop)

    // Backup: Regular intervals
    const intervals = [
      setInterval(forceReposition, 100), // Very frequent checks
      setInterval(forceReposition, 500),
      setInterval(forceReposition, 1000),
    ]

    // Backup: Timeouts for initial load
    const timeouts = [0, 50, 100, 200, 300, 500, 750, 1000, 2000, 3000].map(
      (delay) => setTimeout(forceReposition, delay)
    )

    // MutationObserver with immediate response
    const observer = new MutationObserver(() => {
      forceReposition()
      requestAnimationFrame(forceReposition)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'id'],
    })

    // Listen for any DOM changes
    const domChanges = [
      'DOMNodeInserted',
      'DOMAttrModified',
      'DOMSubtreeModified',
    ]
    domChanges.forEach((event) => {
      document.addEventListener(event, forceReposition)
    })

    return () => {
      cancelAnimationFrame(rafId)
      intervals.forEach(clearInterval)
      timeouts.forEach(clearTimeout)
      observer.disconnect()
      domChanges.forEach((event) => {
        document.removeEventListener(event, forceReposition)
      })
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
