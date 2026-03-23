import { useState, useEffect, Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import './styles/App.css'

import SEO from "./components/SEO"
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Highlights from './components/Highlights.jsx'

import AdminLayout from './admin/AdminLayout.jsx'

// Lazy load portal routes
const Collaborations = lazy(() => import('./components/Collaborations.jsx'))
const Events = lazy(() => import('./components/Events.jsx'))
const Team = lazy(() => import('./components/Team.jsx'))
const CTA = lazy(() => import('./components/CTA.jsx'))
const Contact = lazy(() => import('./components/Contact.jsx'))
const Footer = lazy(() => import('./components/Footer.jsx'))

// Pages
const About = lazy(() => import('./components/About.jsx'))
const Login = lazy(() => import('./components/Login.jsx'))
const Register = lazy(() => import('./components/Register.jsx'))
const EventsPage = lazy(() => import('./components/EventsPage.jsx'))

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
    Loading...
  </div>
)

function App() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') {
      setTheme('light')
      document.body.classList.add('light-theme')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.body.classList.toggle('light-theme')
    localStorage.setItem('theme', newTheme)
  }

  const HomePage = () => (
    <>
      <SEO
        title="C-Square — The Coding Club | Challenges, Workshops & Hackathons"
        description="C-Square is a student coding club focused on competitive programming, technical workshops, hackathons, and real-world projects. Join 500+ coders today."
        canonical="https://csquareofficial.vercel.app/"
        ogImage="/og-image.png"
      />
      <div className="App">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>

        <Navbar theme={theme} toggleTheme={toggleTheme} />
        {/* Above the fold (loads instantly) */}
        <Hero />
        <Highlights />

        {/* Below the fold (lazy loaded for performance) */}
        <Suspense fallback={<LoadingFallback />}>
          <Events />
          <Team />
          <Collaborations />
          <CTA />
          <Contact />
          <Footer />
        </Suspense>
      </div>
    </>
  )

  return (
    <Suspense fallback={<div className="admin-shell"><LoadingFallback /></div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/events" element={<EventsPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/login" element={<Login theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/register" element={<Register theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/admin/*" element={<AdminLayout theme={theme} toggleTheme={toggleTheme} />} />
      </Routes>
    </Suspense>
  )
}

export default App
