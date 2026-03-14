import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Logo from "../assets/white-logo.png";
import customLogo from "../assets/CU.svg";

const Navbar = ({ theme, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className={`flex justify-between items-center w-full mx-auto sticky z-50 transition-all duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isScrolled ? 'px-[2%] py-[14px] max-w-[1400px] top-[20px] bg-glassBg backdrop-blur-[12px] border border-glassBorder rounded-[52px] shadow-[0_10px_30px_rgba(0,0,0,0.1)]' : 'px-[6%] py-[22px] max-w-full top-0 bg-transparent border-none rounded-none'}`}>
      <button className="md:hidden bg-transparent border-none text-[1.4rem] text-textMain cursor-pointer" onClick={toggleMenu} aria-label="Toggle menu">☰</button>
      <div><img src={Logo} alt="C-Square Logo" className="h-[25px] w-auto navbar-logo" /></div>

      <div className="flex items-center gap-3">
        <div className={`fixed top-[64px] left-0 right-0 w-full bg-glassBg backdrop-blur-[20px] border-t border-glassBorder rounded-none p-[20px_24px] flex-col gap-[18px] text-center z-[999] md:static md:w-auto md:bg-transparent md:backdrop-filter-none md:border-none md:p-0 md:flex-row md:gap-0 md:flex items-center ${isMenuOpen ? 'flex' : 'hidden'}`}>
          <Link to="/" className="text-textMuted md:ml-[28px] no-underline text-base md:text-[0.92rem] m-0 hover:text-textMain">Home</Link>
          <Link to="/about" className="text-textMuted md:ml-[28px] no-underline text-base md:text-[0.92rem] m-0 hover:text-textMain">About</Link>
          <a href="/#events" className="text-textMuted md:ml-[28px] no-underline text-base md:text-[0.92rem] m-0 hover:text-textMain">Events</a>
          <a href="/#team" className="text-textMuted md:ml-[28px] no-underline text-base md:text-[0.92rem] m-0 hover:text-textMain">Team</a>
          <a href="/#collaborations" className="text-textMuted md:ml-[28px] no-underline text-base md:text-[0.92rem] m-0 hover:text-textMain">Collaborations</a>
        </div>
        <Link to="/login" className="inline-flex items-center justify-center px-[20px] py-[8px] bg-primary text-[#111111] font-sans text-[0.88rem] font-bold no-underline rounded-[10px] tracking-[0.3px] whitespace-nowrap leading-none h-[38px] transition-shadow duration-250 ease-in-out shadow-[0_4px_14px_rgba(255,215,0,0.3)] hover:bg-primary hover:text-[#111111] hover:shadow-[0_6px_20px_rgba(255,215,0,0.3),0_0_0_2px_rgba(255,215,0,0.2)]">Join Us</Link>
        <button className="bg-[rgba(255,255,255,0.06)] border border-glassBorder text-textMain px-[12px] py-[8px] rounded-[10px] cursor-pointer text-base leading-none flex items-center justify-center" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌞' : '🌙'}
        </button>
      </div>
    </nav>
  )
}

export default Navbar