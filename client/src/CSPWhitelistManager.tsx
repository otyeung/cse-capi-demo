// src/CSPWhitelistManager.tsx
import React, { useState, useEffect } from 'react'

interface LinkedInSource {
  url: string
  label: string
  scriptSrc: boolean
  imgSrc: boolean
  connectSrc: boolean
}

interface StaticSource {
  value: string
  label: string
  scriptSrc: boolean
  imgSrc: boolean
  connectSrc: boolean
  frameSrc: boolean
  description: string
}

const CSPWhitelistManager: React.FC = () => {
  const initialStaticSources: StaticSource[] = [
    {
      value: "'self'",
      label: "'self'",
      scriptSrc: true,
      imgSrc: true,
      connectSrc: true,
      frameSrc: false,
      description: 'Allow resources from same origin',
    },
    {
      value: "'unsafe-inline'",
      label: "'unsafe-inline'",
      scriptSrc: true,
      imgSrc: false,
      connectSrc: false,
      frameSrc: false,
      description: 'Allow inline scripts',
    },
    {
      value: "'unsafe-eval'",
      label: "'unsafe-eval'",
      scriptSrc: true,
      imgSrc: false,
      connectSrc: false,
      frameSrc: false,
      description: 'Allow eval() in scripts',
    },
    {
      value: 'data:',
      label: 'data:',
      scriptSrc: false,
      imgSrc: true,
      connectSrc: false,
      frameSrc: false,
      description: 'Allow data URIs',
    },
    {
      value: 'https://www.googletagmanager.com',
      label: 'googletagmanager.com',
      scriptSrc: true,
      imgSrc: true,
      connectSrc: false,
      frameSrc: true,
      description: 'Google Tag Manager',
    },
    {
      value: 'http://localhost:4000',
      label: 'localhost:4000',
      scriptSrc: false,
      imgSrc: false,
      connectSrc: true,
      frameSrc: false,
      description: 'Local API server',
    },
    {
      value: 'https://cse-capi-demo-api.vercel.app',
      label: 'vercel.app API',
      scriptSrc: false,
      imgSrc: false,
      connectSrc: true,
      frameSrc: false,
      description: 'Production API server',
    },
  ]

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

  const [staticSources, setStaticSources] = useState<StaticSource[]>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('csp-static-sources')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Check if the data has the frameSrc property (migration)
        if (parsed[0] && parsed[0].frameSrc === undefined) {
          console.log('Migrating old localStorage data...')
          localStorage.removeItem('csp-static-sources')
          return initialStaticSources
        }
        return parsed
      } catch (e) {
        console.error('Error parsing localStorage:', e)
        return initialStaticSources
      }
    }
    return initialStaticSources
  })

  const [sources, setSources] = useState<LinkedInSource[]>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('csp-linkedin-sources')
    return saved ? JSON.parse(saved) : initialSources
  })

  const [appliedSources, setAppliedSources] =
    useState<LinkedInSource[]>(sources)
  const [appliedStaticSources, setAppliedStaticSources] =
    useState<StaticSource[]>(staticSources)

  const handleToggle = (
    index: number,
    directive: 'scriptSrc' | 'imgSrc' | 'connectSrc'
  ) => {
    const newSources = [...sources]
    newSources[index][directive] = !newSources[index][directive]
    setSources(newSources)
  }

  const handleStaticToggle = (
    index: number,
    directive: 'scriptSrc' | 'imgSrc' | 'connectSrc' | 'frameSrc'
  ) => {
    const newSources = [...staticSources]
    newSources[index][directive] = !newSources[index][directive]
    setStaticSources(newSources)
  }

  const handleApply = () => {
    // Save to localStorage
    localStorage.setItem('csp-linkedin-sources', JSON.stringify(sources))
    localStorage.setItem('csp-static-sources', JSON.stringify(staticSources))
    setAppliedSources(sources)
    setAppliedStaticSources(staticSources)

    // Update CSP meta tag
    updateCSPMetaTag(staticSources, sources)

    // Show confirmation
    alert(
      'Content Security Policy updated successfully! The page will reload to apply changes.'
    )

    // Reload page to apply new CSP
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  const handleReset = () => {
    if (
      confirm(
        'This will reset all CSP settings to default values. Are you sure?'
      )
    ) {
      localStorage.removeItem('csp-linkedin-sources')
      localStorage.removeItem('csp-static-sources')
      setSources(initialSources)
      setStaticSources(initialStaticSources)
      alert('Settings reset! Click Apply Changes to reload with defaults.')
    }
  }

  const updateCSPMetaTag = (
    staticSources: StaticSource[],
    sources: LinkedInSource[]
  ) => {
    // Remove existing CSP meta tag
    const existingMeta = document.querySelector(
      'meta[http-equiv="Content-Security-Policy"]'
    )
    if (existingMeta) {
      existingMeta.remove()
    }

    // Build CSP directives
    const scriptSrcStatic = staticSources
      .filter((s) => s.scriptSrc)
      .map((s) => s.value)

    const imgSrcStatic = staticSources
      .filter((s) => s.imgSrc)
      .map((s) => s.value)

    const connectSrcStatic = staticSources
      .filter((s) => s.connectSrc)
      .map((s) => s.value)

    const frameSrcStatic = staticSources
      .filter((s) => s.frameSrc)
      .map((s) => s.value)

    const scriptSrcUrls = sources
      .filter((s) => s.scriptSrc)
      .map((s) => `https://${s.url}`)

    const imgSrcUrls = sources
      .filter((s) => s.imgSrc)
      .map((s) => `https://${s.url}`)

    const connectSrcUrls = sources
      .filter((s) => s.connectSrc)
      .map((s) => `https://${s.url}`)

    const scriptSrc = [...scriptSrcStatic, ...scriptSrcUrls].join(' ')

    const imgSrc = [...imgSrcStatic, ...imgSrcUrls].join(' ')

    const connectSrc = [...connectSrcStatic, ...connectSrcUrls].join(' ')

    const frameSrc = frameSrcStatic.join(' ')

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
      ${frameSrc ? `frame-src ${frameSrc};` : ''}
    `
      .replace(/\s+/g, ' ')
      .trim()

    document.head.appendChild(meta)
  }

  useEffect(() => {
    // Apply CSP on initial load
    updateCSPMetaTag(appliedStaticSources, appliedSources)
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

        {/* Static CSP Sources Section */}
        <div style={{ marginBottom: '20px' }}>
          <h4
            style={{
              margin: '0 0 10px 0',
              color: '#333',
              fontSize: '15px',
              fontWeight: 'bold',
            }}
          >
            Core CSP Settings
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '15px',
            }}
          >
            {staticSources.map((source, index) => (
              <div
                key={source.value}
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
                    marginBottom: '4px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    color: '#0073b1',
                  }}
                >
                  {source.label}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#666',
                    marginBottom: '8px',
                    fontStyle: 'italic',
                  }}
                >
                  {source.description}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      padding: '3px',
                      backgroundColor: source.scriptSrc
                        ? '#e7f3ff'
                        : 'transparent',
                      borderRadius: '3px',
                      opacity: source.scriptSrc ? 1 : 0.5,
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={source.scriptSrc}
                      onChange={() => handleStaticToggle(index, 'scriptSrc')}
                      style={{
                        marginRight: '6px',
                        width: '14px',
                        height: '14px',
                        cursor: 'pointer',
                      }}
                    />
                    <span style={{ fontSize: '12px' }}>script-src</span>
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      padding: '3px',
                      backgroundColor: source.imgSrc
                        ? '#e7f3ff'
                        : 'transparent',
                      borderRadius: '3px',
                      opacity: source.imgSrc ? 1 : 0.5,
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={source.imgSrc}
                      onChange={() => handleStaticToggle(index, 'imgSrc')}
                      style={{
                        marginRight: '6px',
                        width: '14px',
                        height: '14px',
                        cursor: 'pointer',
                      }}
                    />
                    <span style={{ fontSize: '12px' }}>img-src</span>
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      padding: '3px',
                      backgroundColor: source.connectSrc
                        ? '#e7f3ff'
                        : 'transparent',
                      borderRadius: '3px',
                      opacity: source.connectSrc ? 1 : 0.5,
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={source.connectSrc}
                      onChange={() => handleStaticToggle(index, 'connectSrc')}
                      style={{
                        marginRight: '6px',
                        width: '14px',
                        height: '14px',
                        cursor: 'pointer',
                      }}
                    />
                    <span style={{ fontSize: '12px' }}>connect-src</span>
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      padding: '3px',
                      backgroundColor: source.frameSrc
                        ? '#e7f3ff'
                        : 'transparent',
                      borderRadius: '3px',
                      opacity: source.frameSrc ? 1 : 0.5,
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={source.frameSrc}
                      onChange={() => handleStaticToggle(index, 'frameSrc')}
                      style={{
                        marginRight: '6px',
                        width: '14px',
                        height: '14px',
                        cursor: 'pointer',
                      }}
                    />
                    <span style={{ fontSize: '12px' }}>frame-src</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LinkedIn Sources Section */}
        <div>
          <h4
            style={{
              margin: '0 0 10px 0',
              color: '#333',
              fontSize: '15px',
              fontWeight: 'bold',
            }}
          >
            LinkedIn Insight Tag Domains
          </h4>
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
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
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
                      backgroundColor: source.imgSrc
                        ? '#e7f3ff'
                        : 'transparent',
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

          <button
            onClick={handleReset}
            style={{
              backgroundColor: '#dc3545',
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
              (e.currentTarget.style.backgroundColor = '#c82333')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = '#dc3545')
            }
          >
            Reset to Defaults
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
