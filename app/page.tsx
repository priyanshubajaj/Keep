'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

function Beat({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function LandingPage() {
  return (
    <div
      style={{
        background: 'var(--paper)',
        minHeight: '100vh',
      }}
    >
      {/* Beat 1 — Hero */}
      <section
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--display-1)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            color: 'var(--ink)',
            fontVariationSettings: '"opsz" 9',
          }}
        >
          Keep
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            bottom: 'var(--space-xl)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--caption)',
            color: 'var(--ink-faint)',
            letterSpacing: '0.05em',
          }}
        >
          scroll
        </motion.p>
      </section>

      {/* Beat 2 — Opening line */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-4xl) var(--space-xl)',
        }}
      >
        <Beat>
          <p
            style={{
              maxWidth: 640,
              fontFamily: 'var(--font-prose)',
              fontSize: 'var(--display-3)',
              fontWeight: 400,
              color: 'var(--ink)',
              lineHeight: 1.35,
              textAlign: 'center',
            }}
          >
            Some voices we don't get to keep.
          </p>
        </Beat>
      </section>

      {/* Beat 3 — The premise */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: 'var(--space-4xl) var(--space-xl)',
        }}
      >
        <Beat>
          <div
            style={{
              maxWidth: 1080,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-2xl)',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                background: `rgba(232, 199, 184, 0.3)`,
                padding: 'var(--space-xl)',
                borderRadius: 2,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-prose)',
                  fontSize: 'var(--body-lg)',
                  color: 'var(--ink)',
                  fontStyle: 'italic',
                  lineHeight: 1.65,
                }}
              >
                "Tell me about the summer your father taught you to drive."
              </p>
            </div>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--body-lg)',
                  color: 'var(--ink)',
                  lineHeight: 1.65,
                  marginBottom: 'var(--space-lg)',
                }}
              >
                Keep is a place to record the people who matter — in their words, in their voice — so you can keep talking with them, long after the conversation would have ended.
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--body-lg)',
                  color: 'var(--ink)',
                  lineHeight: 1.65,
                }}
              >
                It works with what you already have. A memoir. Letters. Voicemails. A morning's worth of recordings made over coffee. Keep listens, builds a faithful inner picture, and so years from now you can still ask, and still hear them answer.
              </p>
            </div>
          </div>
        </Beat>
      </section>

      {/* Beat 4 — How it works */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: 'var(--space-4xl) var(--space-xl)',
        }}
      >
        <Beat>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--display-3)',
                fontWeight: 400,
                color: 'var(--ink)',
                letterSpacing: '-0.02em',
                marginBottom: 'var(--space-xl)',
              }}
            >
              How Keep listens
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 'var(--space-lg)',
              }}
            >
              {[
                {
                  num: '01',
                  title: 'What you give it.',
                  body: 'A written memoir, a stack of letters, an hour of recordings, or all three. The more material, the more faithful the persona.',
                },
                {
                  num: '02',
                  title: 'What it builds.',
                  body: "Keep reads everything, organizes the memories by topic and time, and writes a persona document — a careful inner portrait that becomes the voice's mind.",
                },
                {
                  num: '03',
                  title: 'What you keep.',
                  body: 'A private space where you, your siblings, your children can ask questions and hear the voice you love answer. Forever, on your terms.',
                },
              ].map((panel) => (
                <div
                  key={panel.num}
                  style={{
                    background: 'var(--paper-deep)',
                    borderRadius: 2,
                    padding: 'var(--space-xl)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--display-3)',
                      fontWeight: 400,
                      color: 'var(--ink-faint)',
                      letterSpacing: '-0.02em',
                      marginBottom: 'var(--space-md)',
                      lineHeight: 1,
                    }}
                  >
                    {panel.num}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--body)',
                      fontWeight: 600,
                      color: 'var(--ink)',
                      marginBottom: 'var(--space-sm)',
                    }}
                  >
                    {panel.title}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-prose)',
                      fontSize: 'var(--body)',
                      color: 'var(--ink-soft)',
                      lineHeight: 1.65,
                    }}
                  >
                    {panel.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Beat>
      </section>

      {/* Beat 5 — A closer look */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-4xl) var(--space-xl)',
          flexDirection: 'column',
          gap: 'var(--space-xl)',
        }}
      >
        <Beat>
          <div
            style={{
              transform: 'rotate(-3deg)',
              background: 'var(--paper)',
              border: '1px solid var(--rule)',
              borderRadius: 8,
              padding: 'var(--space-xl)',
              boxShadow: `0 24px 64px var(--shadow)`,
              maxWidth: 560,
              width: '100%',
            }}
          >
            {/* Simulated conversation preview */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--caption)', color: 'var(--ink-faint)', marginBottom: 6 }}>you</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--small)', color: 'var(--ink-soft)' }}>
                Tell me about the kitchen in the house you grew up in.
              </p>
            </div>
            <div style={{ height: 1, background: 'var(--rule)', marginBottom: 'var(--space-lg)' }} />
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--caption)', color: 'var(--ink-faint)', marginBottom: 6 }}>Margaret · played 0:34</p>
              <p style={{
                fontFamily: 'var(--font-prose)',
                fontSize: 'var(--body)',
                color: 'var(--ink)',
                lineHeight: 1.65,
                fontStyle: 'italic',
                marginBottom: 'var(--space-md)',
              }}>
                The kitchen at Helstone was small and smelled of woodsmoke and dried lavender. My aunt kept lavender in a cracked bowl on the windowsill. It was always cracked. We never replaced it.
              </p>
              {/* Simulated audio player */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="8" height="10" viewBox="0 0 10 12" fill="var(--ink)"><polygon points="0,0 10,6 0,12" /></svg>
                </div>
                <div style={{ flex: 1, height: 2, background: 'var(--rule)', borderRadius: 1, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '45%', background: 'var(--accent)', borderRadius: 1 }} />
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--caption)', color: 'var(--ink-faint)' }}>0:34</span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--caption)', color: 'var(--ink-faint)', fontStyle: 'italic', marginTop: 12 }}>
                from her memoir, chapter 1 — "The Parsonage"
              </p>
            </div>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-prose)',
              fontSize: 'var(--small)',
              color: 'var(--ink-soft)',
              fontStyle: 'italic',
              textAlign: 'center',
              marginTop: 'var(--space-lg)',
              maxWidth: 480,
            }}
          >
            Margaret Hale's memoir is public domain. We made a Keep persona from it as a demonstration. Anyone you create is private to you.
          </p>
        </Beat>
      </section>

      {/* Beat 6 — Begin */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-4xl) var(--space-xl)',
          gap: 'var(--space-2xl)',
        }}
      >
        <Beat>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--display-2)',
              fontWeight: 400,
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
              textAlign: 'center',
              marginBottom: 'var(--space-2xl)',
            }}
          >
            Begin.
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 480px))',
              gap: 'var(--space-lg)',
              justifyContent: 'center',
            }}
          >
            <CTACard
              label="CREATE"
              title="Begin a new keep"
              body="For someone you want to record while they're here, or whose words you already have."
              buttonText="Begin →"
              href="/begin"
              accent
            />
            <CTACard
              label="EXPLORE"
              title="Try a finished one"
              body="Margaret Hale, English memoirist, 1855–1937. We built her from her published memoir. Have a conversation."
              buttonText="Open Margaret →"
              href="/conversation/margaret-hale"
              accent={false}
            />
          </div>
        </Beat>
      </section>

      {/* Beat 7 — Footer */}
      <footer
        style={{
          minHeight: '40vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-md)',
          padding: 'var(--space-3xl) var(--space-xl)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--caption)',
            color: 'var(--ink-faint)',
            textAlign: 'center',
          }}
        >
          Keep is private by design. Your recordings, your text, your persona — yours.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-xl)' }}>
          {['How it works', 'Privacy', 'Contact'].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--caption)',
                color: 'var(--ink-faint)',
                textDecoration: 'none',
                borderBottom: '1px solid transparent',
              }}
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}

function CTACard({
  label,
  title,
  body,
  buttonText,
  href,
  accent,
}: {
  label: string
  title: string
  body: string
  buttonText: string
  href: string
  accent: boolean
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'var(--paper-deep)',
        borderRadius: 8,
        padding: 'var(--space-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
        cursor: 'pointer',
        border: '1px solid var(--rule)',
        minHeight: 280,
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--caption)',
          fontWeight: 600,
          letterSpacing: '0.1em',
          color: accent ? 'var(--accent)' : 'var(--ink-faint)',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </p>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--display-3)',
          fontWeight: 400,
          color: 'var(--ink)',
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--body)',
          color: 'var(--ink-soft)',
          lineHeight: 1.5,
          flex: 1,
        }}
      >
        {body}
      </p>
      <Link
        href={href}
        style={{
          display: 'inline-block',
          padding: accent ? '12px 24px' : 0,
          background: accent ? 'var(--accent)' : 'transparent',
          color: accent ? 'white' : 'var(--accent)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--body)',
          fontWeight: 600,
          textDecoration: 'none',
          borderRadius: accent ? 2 : 0,
          alignSelf: 'flex-start',
          borderBottom: accent ? 'none' : '1px solid var(--accent)',
        }}
      >
        {buttonText}
      </Link>
    </motion.div>
  )
}
