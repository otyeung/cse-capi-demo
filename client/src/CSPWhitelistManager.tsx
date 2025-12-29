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
  styleSrc: boolean
  fontSrc: boolean
  description: string
}

const CSPWhitelistManager: React.FC = () => {
  const initialStaticSources: StaticSource[] = [
    {
      value: "'self'",
      label: "'self'",
      scriptSrc: false,
      imgSrc: false,
      connectSrc: false,
      frameSrc: false,
      styleSrc: false,
      fontSrc: false,
      description: 'Allow resources from same origin',
    },
    {
      value: "'unsafe-inline'",
      label: "'unsafe-inline'",
      scriptSrc: false,
      imgSrc: false,
      connectSrc: false,
      frameSrc: false,
      styleSrc: false,
      fontSrc: false,
      description: 'Allow inline scripts',
    },
    {
      value: "'unsafe-eval'",
      label: "'unsafe-eval'",
      scriptSrc: false,
      imgSrc: false,
      connectSrc: false,
      frameSrc: false,
      styleSrc: false,
      fontSrc: false,
      description: 'Allow eval() in scripts',
    },
    {
      value: 'data:',
      label: 'data:',
      scriptSrc: false,
      imgSrc: true,
      connectSrc: false,
      frameSrc: false,
      styleSrc: false,
      fontSrc: false,
      description: 'Allow data URIs',
    },
    {
      value: 'https://www.googletagmanager.com',
      label: 'googletagmanager.com',
      scriptSrc: true,
      imgSrc: true,
      connectSrc: false,
      frameSrc: false,
      styleSrc: true,
      fontSrc: false,
      description: 'Google Tag Manager',
    },
    {
      value: 'https://fonts.googleapis.com',
      label: 'fonts.googleapis.com',
      scriptSrc: false,
      imgSrc: false,
      connectSrc: false,
      frameSrc: false,
      styleSrc: true,
      fontSrc: false,
      description: 'Google Fonts API',
    },
    {
      value: 'https://fonts.gstatic.com',
      label: 'fonts.gstatic.com',
      scriptSrc: false,
      imgSrc: false,
      connectSrc: false,
      frameSrc: false,
      styleSrc: false,
      fontSrc: true,
      description: 'Google Fonts Static Resources',
    },
    {
      value: 'http://localhost:4000',
      label: 'localhost:4000',
      scriptSrc: false,
      imgSrc: false,
      connectSrc: false,
      frameSrc: false,
      styleSrc: false,
      fontSrc: false,
      description: 'Local API server',
    },
    {
      value: 'https://cse-capi-demo-api.vercel.app',
      label: 'vercel.app API',
      scriptSrc: false,
      imgSrc: false,
      connectSrc: false,
      frameSrc: false,
      styleSrc: false,
      fontSrc: false,
      description: 'Production API server',
    },
    {
      value: 'https://cse-capi-demo.vercel.app',
      label: 'cse-capi-demo.vercel.app',
      scriptSrc: true,
      imgSrc: true,
      connectSrc: false,
      frameSrc: false,
      styleSrc: true,
      fontSrc: false,
      description: 'Production App (for scripts/styles/images)',
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
      url: 'px.ads.linkedin.com/wa',
      label: 'px.ads.linkedin.com/wa',
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
      url: 'cdn.linkedin.oribi.io',
      label: 'cdn.linkedin.oribi.io',
      scriptSrc: true,
      imgSrc: true,
      connectSrc: true,
    },
    {
      url: 'gw.linkedin.oribi.io',
      label: 'gw.linkedin.oribi.io',
      scriptSrc: true,
      imgSrc: true,
      connectSrc: true,
    },
    {
      url: 'sjs.bizographics.com',
      label: 'sjs.bizographics.com',
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
        // Check if the data has the new properties (migration)
        if (
          parsed[0] &&
          (parsed[0].styleSrc === undefined || parsed[0].fontSrc === undefined)
        ) {
          console.log(
            'Migrating old localStorage data to include style-src and font-src...'
          )
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
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Safety check: if all sources are disabled, reset to defaults
        const hasAnyEnabled = parsed.some(
          (s: LinkedInSource) => s.scriptSrc || s.imgSrc || s.connectSrc
        )
        if (!hasAnyEnabled) {
          console.log('All sources disabled - resetting to defaults...')
          localStorage.removeItem('csp-linkedin-sources')
          return initialSources
        }
        return parsed
      } catch (e) {
        console.error('Error parsing LinkedIn sources:', e)
        return initialSources
      }
    }
    return initialSources
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
    directive:
      | 'scriptSrc'
      | 'imgSrc'
      | 'connectSrc'
      | 'frameSrc'
      | 'styleSrc'
      | 'fontSrc'
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

    // Log CSP changes to console
    console.log('=== Apply changes to CSP ===')
    console.log('Static Sources:', {
      enabled: staticSources.filter(
        (s) =>
          s.scriptSrc ||
          s.imgSrc ||
          s.connectSrc ||
          s.frameSrc ||
          s.styleSrc ||
          s.fontSrc
      ),
      all: staticSources,
    })
    console.log('LinkedIn Sources:', {
      enabled: sources.filter((s) => s.scriptSrc || s.imgSrc || s.connectSrc),
      all: sources,
    })

    // Build and log the actual CSP directives
    const scriptSrcStatic = staticSources
      .filter((s) => s.scriptSrc)
      .map((s) => s.value)
    const scriptSrcUrls = sources
      .filter((s) => s.scriptSrc)
      .map((s) => `https://${s.url}`)
    const imgSrcStatic = staticSources
      .filter((s) => s.imgSrc)
      .map((s) => s.value)
    const imgSrcUrls = sources
      .filter((s) => s.imgSrc)
      .map((s) => `https://${s.url}`)
    const connectSrcStatic = staticSources
      .filter((s) => s.connectSrc)
      .map((s) => s.value)
    const connectSrcUrls = sources
      .filter((s) => s.connectSrc)
      .map((s) => `https://${s.url}`)
    const frameSrcStatic = staticSources
      .filter((s) => s.frameSrc)
      .map((s) => s.value)
    const styleSrcStatic = staticSources
      .filter((s) => s.styleSrc)
      .map((s) => s.value)
    const fontSrcStatic = staticSources
      .filter((s) => s.fontSrc)
      .map((s) => s.value)

    console.log('CSP Directives:', {
      'script-src': [...scriptSrcStatic, ...scriptSrcUrls],
      'img-src': [...imgSrcStatic, ...imgSrcUrls],
      'connect-src': [...connectSrcStatic, ...connectSrcUrls],
      'frame-src': frameSrcStatic,
      'style-src': styleSrcStatic,
      'font-src': fontSrcStatic,
    })

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
      window.confirm(
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

    const styleSrcStatic = staticSources
      .filter((s) => s.styleSrc)
      .map((s) => s.value)

    const fontSrcStatic = staticSources
      .filter((s) => s.fontSrc)
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

    const styleSrc =
      styleSrcStatic.length > 0
        ? styleSrcStatic.join(' ')
        : "'self' 'unsafe-inline'"

    const fontSrc =
      fontSrcStatic.length > 0 ? fontSrcStatic.join(' ') : "'self' data:"

    // Create new CSP meta tag
    const meta = document.createElement('meta')
    meta.httpEquiv = 'Content-Security-Policy'
    meta.content = `
      default-src 'self';
      script-src ${scriptSrc};
      style-src ${styleSrc};
      img-src ${imgSrc};
      font-src ${fontSrc};
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

    // Log CSP configuration on window load
    console.log('=== CSP Whitelist Configuration (Window Loaded) ===')
    console.log('Static Sources:', {
      enabled: appliedStaticSources.filter(
        (s) => s.scriptSrc || s.imgSrc || s.connectSrc || s.frameSrc
      ),
      all: appliedStaticSources,
    })
    console.log('LinkedIn Sources:', {
      enabled: appliedSources.filter(
        (s) => s.scriptSrc || s.imgSrc || s.connectSrc
      ),
      all: appliedSources,
    })

    // Build and log the actual CSP directives
    const scriptSrcStatic = appliedStaticSources
      .filter((s) => s.scriptSrc)
      .map((s) => s.value)
    const scriptSrcUrls = appliedSources
      .filter((s) => s.scriptSrc)
      .map((s) => `https://${s.url}`)
    const imgSrcStatic = appliedStaticSources
      .filter((s) => s.imgSrc)
      .map((s) => s.value)
    const imgSrcUrls = appliedSources
      .filter((s) => s.imgSrc)
      .map((s) => `https://${s.url}`)
    const connectSrcStatic = appliedStaticSources
      .filter((s) => s.connectSrc)
      .map((s) => s.value)
    const connectSrcUrls = appliedSources
      .filter((s) => s.connectSrc)
      .map((s) => `https://${s.url}`)
    const frameSrcStatic = appliedStaticSources
      .filter((s) => s.frameSrc)
      .map((s) => s.value)

    console.log('Active CSP Directives:', {
      'script-src': [...scriptSrcStatic, ...scriptSrcUrls],
      'img-src': [...imgSrcStatic, ...imgSrcUrls],
      'connect-src': [...connectSrcStatic, ...connectSrcUrls],
      'frame-src': frameSrcStatic,
    })
    console.log('===================================')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        minHeight: 'calc(100vh - 65px)',
      }}
    >
      <div style={{ width: '100%' }}>
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
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      padding: '3px',
                      backgroundColor: source.styleSrc
                        ? '#e7f3ff'
                        : 'transparent',
                      borderRadius: '3px',
                      opacity: source.styleSrc ? 1 : 0.5,
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={source.styleSrc}
                      onChange={() => handleStaticToggle(index, 'styleSrc')}
                      style={{
                        marginRight: '6px',
                        width: '14px',
                        height: '14px',
                        cursor: 'pointer',
                      }}
                    />
                    <span style={{ fontSize: '12px' }}>style-src</span>
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      padding: '3px',
                      backgroundColor: source.fontSrc
                        ? '#e7f3ff'
                        : 'transparent',
                      borderRadius: '3px',
                      opacity: source.fontSrc ? 1 : 0.5,
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={source.fontSrc}
                      onChange={() => handleStaticToggle(index, 'fontSrc')}
                      style={{
                        marginRight: '6px',
                        width: '14px',
                        height: '14px',
                        cursor: 'pointer',
                      }}
                    />
                    <span style={{ fontSize: '12px' }}>font-src</span>
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

        <div
          style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid #ddd',
          }}
        >
          <a
            href='https://www.linkedin.com/help/lms/answer/a425696'
            target='_blank'
            rel='noopener noreferrer'
            style={{
              color: '#0073b1',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.textDecoration = 'underline')
            }
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            📚 Troubleshoot the LinkedIn Insight Tag
          </a>
        </div>
      </div>
    </div>
  )
}

export default CSPWhitelistManager
