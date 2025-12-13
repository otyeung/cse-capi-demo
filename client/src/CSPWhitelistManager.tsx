// src/CSPWhitelistManager.tsx
import React, { useState, useEffect } from 'react'

interface LinkedInSource {
  url: string
  label: string
  scriptSrc: boolean
  imgSrc: boolean
  connectSrc: boolean
}

const CSPWhitelistManager: React.FC = () => {
  const initialSources: LinkedInSource[] = [
    {
      url: 'px.ads.linkedin.com',
      label: 'px.ads.linkedin.com',
      scriptSrc: true,
      imgSrc: true,
      connectSrc: true,
    },
    {
      url: 'px4.ads.linkedin.com',
      label: 'px4.ads.linkedin.com',
      scriptSrc: true,
      imgSrc: true,
      connectSrc: true,
    },
    {
      url: 'dc.ads.linkedin.com',
      label: 'dc.ads.linkedin.com',
      scriptSrc: true,
      imgSrc: true,
      connectSrc: true,
    },
    {
      url: 'snap.licdn.com',
      label: 'snap.licdn.com',
      scriptSrc: true,
      imgSrc: true,
      connectSrc: true,
    },
    {
      url: 'p.adsymptotic.com',
      label: 'p.adsymptotic.com',
      scriptSrc: true,
      imgSrc: true,
      connectSrc: true,
    },
  ]

  const [sources, setSources] = useState<LinkedInSource[]>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('csp-linkedin-sources')
    return saved ? JSON.parse(saved) : initialSources
  })

  const [appliedSources, setAppliedSources] =
    useState<LinkedInSource[]>(sources)

  const handleToggle = (
    index: number,
    directive: 'scriptSrc' | 'imgSrc' | 'connectSrc'
  ) => {
    const newSources = [...sources]
    newSources[index][directive] = !newSources[index][directive]
    setSources(newSources)
  }

  const handleApply = () => {
    // Save to localStorage
    localStorage.setItem('csp-linkedin-sources', JSON.stringify(sources))
    setAppliedSources(sources)

    // Update CSP meta tag
    updateCSPMetaTag(sources)

    // Show confirmation
    alert(
      'Content Security Policy updated successfully! The page will reload to apply changes.'
    )

    // Reload page to apply new CSP
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  const updateCSPMetaTag = (sources: LinkedInSource[]) => {
    // Remove existing CSP meta tag
    const existingMeta = document.querySelector(
      'meta[http-equiv="Content-Security-Policy"]'
    )
    if (existingMeta) {
      existingMeta.remove()
    }

    // Build CSP directives
    const scriptSrcUrls = sources
      .filter((s) => s.scriptSrc)
      .map((s) => `https://${s.url}`)

    const imgSrcUrls = sources
      .filter((s) => s.imgSrc)
      .map((s) => `https://${s.url}`)

    const connectSrcUrls = sources
      .filter((s) => s.connectSrc)
      .map((s) => `https://${s.url}`)

    const scriptSrc = [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      'https://www.googletagmanager.com',
      ...scriptSrcUrls,
    ].join(' ')

    const imgSrc = [
      "'self'",
      'data:',
      'https://www.googletagmanager.com',
      ...imgSrcUrls,
    ].join(' ')

    // Get server URL - include both local and production endpoints
    // Also include LinkedIn domains for fetch/XHR requests
    const connectSrc = [
      "'self'",
      'http://localhost:4000',
      'https://cse-capi-demo-api.vercel.app',
      ...connectSrcUrls,
    ].join(' ')

    // Create new CSP meta tag
    const meta = document.createElement('meta')
    meta.httpEquiv = 'Content-Security-Policy'
    meta.content = `
      default-src 'self';
      script-src ${scriptSrc};
      style-src 'self' 'unsafe-inline';
      img-src ${imgSrc};
      font-src 'self' data:;
      connect-src ${connectSrc};
      frame-src https://www.googletagmanager.com;
    `
      .replace(/\s+/g, ' ')
      .trim()

    document.head.appendChild(meta)
  }

  useEffect(() => {
    // Apply CSP on initial load
    updateCSPMetaTag(appliedSources)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#f5f5f5',
        borderTop: '2px solid #0073b1',
        padding: '20px',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h3
          style={{
            margin: '0 0 15px 0',
            color: '#0073b1',
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          LinkedIn Insight Tag - Content Security Policy Whitelist
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '15px',
            marginBottom: '15px',
          }}
        >
          {sources.map((source, index) => (
            <div
              key={source.url}
              style={{
                padding: '12px',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            >
              <div
                style={{
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  color: '#0073b1',
                }}
              >
                {source.label}
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '4px',
                    backgroundColor: source.scriptSrc
                      ? '#e7f3ff'
                      : 'transparent',
                    borderRadius: '3px',
                  }}
                >
                  <input
                    type='checkbox'
                    checked={source.scriptSrc}
                    onChange={() => handleToggle(index, 'scriptSrc')}
                    style={{
                      marginRight: '8px',
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{ fontSize: '13px' }}>script-src</span>
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '4px',
                    backgroundColor: source.imgSrc ? '#e7f3ff' : 'transparent',
                    borderRadius: '3px',
                  }}
                >
                  <input
                    type='checkbox'
                    checked={source.imgSrc}
                    onChange={() => handleToggle(index, 'imgSrc')}
                    style={{
                      marginRight: '8px',
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{ fontSize: '13px' }}>img-src</span>
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '4px',
                    backgroundColor: source.connectSrc
                      ? '#e7f3ff'
                      : 'transparent',
                    borderRadius: '3px',
                  }}
                >
                  <input
                    type='checkbox'
                    checked={source.connectSrc}
                    onChange={() => handleToggle(index, 'connectSrc')}
                    style={{
                      marginRight: '8px',
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{ fontSize: '13px' }}>connect-src</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={handleApply}
            style={{
              backgroundColor: '#0073b1',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = '#005885')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = '#0073b1')
            }
          >
            Apply Changes
          </button>

          <span style={{ fontSize: '14px', color: '#666' }}>
            script-src: {sources.filter((s) => s.scriptSrc).length} | img-src:{' '}
            {sources.filter((s) => s.imgSrc).length} | connect-src:{' '}
            {sources.filter((s) => s.connectSrc).length} of {sources.length}{' '}
            sources
          </span>
        </div>

        <p
          style={{
            marginTop: '10px',
            fontSize: '12px',
            color: '#666',
            fontStyle: 'italic',
          }}
        >
          Note: Changes will be applied immediately and the page will reload to
          update the Content Security Policy.
        </p>
      </div>
    </div>
  )
}

export default CSPWhitelistManager
