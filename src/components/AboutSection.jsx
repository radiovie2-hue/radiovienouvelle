import React, { useEffect, useRef } from 'react'
import { Info, Sparkles } from 'lucide-react'
import WaveDivider from './WaveDivider'
import './AboutSection.css'
import aboutImg from '../../image/ChatGPT Image 6 juil. 2026, 09_59_13.png'

export default function AboutSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })

    if (sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll('.reveal')
      elements.forEach(el => observer.observe(el))
      
      return () => {
        elements.forEach(el => observer.unobserve(el))
      }
    }
  }, [])

  return (
    <section className="about-section" id="a-propos" ref={sectionRef}>
      <div className="container about__container">
        
        {/* Left: Text Content */}
        <div className="about__content reveal">
          <div className="about__badge">
            <Info size={14} className="text-gold" />
            <span>À Propos de Nous</span>
          </div>
          
          <h2 className="about__title">
            Plus qu'une radio, une <span className="text-gradient">famille spirituelle</span>
          </h2>
          
          <div className="about__text-block">
            <p>
              Bienvenue sur <strong>Radio Vie Nouvelle FM 107.8</strong>, la voix de l'espérance et du réveil spirituel. 
              Née d'une vision divine, notre mission est de propager la parole de Dieu, d'édifier la foi 
              des croyants et d'apporter la lumière dans chaque foyer.
            </p>
            <p>
              Nous vous accompagnons au quotidien avec une grille de programmes riche et variée : 
              des moments de louange intenses, des enseignements bibliques profonds, des talk-shows 
              inspirants et des temps de prière prophétique en direct. 
            </p>
          </div>
        </div>

        {/* Right: Image */}
        <div className="about__visual reveal reveal-delay-1">
          <div className="about__image-container">
            <img src={aboutImg} alt="Studio Radio Vie Nouvelle" className="about__img" />
          </div>
        </div>

      </div>

      <WaveDivider />
    </section>
  )
}
