import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { PlayerProvider } from './context/PlayerContext'
import Navbar from './components/layout/Navbar'
import HeroSection from './components/HeroSection'
import ShowsGrid from './components/ShowsGrid'
import PodcastsSection from './components/PodcastsSection'
import AboutSection from './components/AboutSection'
import PartnerSection from './components/PartnerSection'
import TeamSection from './components/TeamSection'
import CommentsSection from './components/CommentsSection'
import DailyProgramsCarousel from './components/DailyProgramsCarousel'
import NewsSection from './components/NewsSection'
import Footer from './components/layout/Footer'
import PlayerBar from './components/PlayerBar'
import Admin from './pages/Admin'
import AnimatorsPage from './pages/AnimatorsPage'
import NewsPage from './pages/NewsPage'
import ShowsPage from './pages/ShowsPage'

function HomePage() {
  const scrollToShows = () => {
    const element = document.getElementById('shows-grid')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main>
        <HeroSection onScrollToShows={scrollToShows} />
        <DailyProgramsCarousel />
        <ShowsGrid />
        <PodcastsSection />
        <NewsSection />
        <AboutSection />
        <PartnerSection />
        <TeamSection />
        <CommentsSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Fixed Player Bar at the bottom */}
      <PlayerBar />
    </>
  )
}

export default function App() {
  return (
    <PlayerProvider>
      <div className="app-layout">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/actualites" element={<NewsPage />} />
          <Route path="/emissions" element={<ShowsPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/animateurs" element={<AnimatorsPage />} />
        </Routes>
      </div>
    </PlayerProvider>
  )
}
