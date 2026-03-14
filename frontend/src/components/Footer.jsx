import { FaLinkedinIn, FaGithub, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-glassBg border-t border-glassBorder pt-[80px] px-6 pb-[40px] relative overflow-hidden before:content-[''] before:absolute before:-bottom-[20%] before:left-1/2 before:-translate-x-1/2 before:w-[60%] before:h-[40%] before:bg-[radial-gradient(circle,rgba(255,215,0,0.1),transparent_70%)] before:blur-[80px] before:z-0 before:pointer-events-none">
            <div className="max-w-[1200px] mx-auto">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-[40px] mb-[60px] relative z-10">
                    {/* Brand Column */}
                    <div className="footer-col footer-brand">
                        <div className="text-[1.8rem] font-[800] text-textMain mb-4 inline-block">C-<span className="text-primary">Square</span>.</div>

                        <p className="text-[1rem] leading-[1.7] text-textMuted mb-6 max-w-[320px]">
                            Empowering students with coding skills, competitions, and a vibrant community of builders and problem-solvers.
                        </p>

                        <div className="flex gap-3 mt-[18px]">
                            <a
                                href="https://www.linkedin.com/"
                                target="_blank"
                                rel="noreferrer"
                                className="group/icon w-[44px] h-[44px] rounded-xl bg-subtleBg border border-subtleBorder grid place-items-center text-textMain no-underline transition-all duration-[250ms] ease hover:-translate-y-1 hover:bg-[rgba(255,215,0,0.18)] hover:border-[rgba(255,215,0,0.35)] hover:shadow-[0_14px_40px_rgba(255,215,0,0.18)] text-[18px]"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedinIn className="transition-transform duration-[250ms] ease" />
                            </a>

                            <a
                                href="https://twitter.com/"
                                target="_blank"
                                rel="noreferrer"
                                className="group/icon w-[44px] h-[44px] rounded-xl bg-subtleBg border border-subtleBorder grid place-items-center text-textMain no-underline transition-all duration-[250ms] ease hover:-translate-y-1 hover:bg-[rgba(255,215,0,0.18)] hover:border-[rgba(255,215,0,0.35)] hover:shadow-[0_14px_40px_rgba(255,215,0,0.18)] text-[18px]"
                                aria-label="Twitter"
                            >
                                <FaXTwitter className="transition-transform duration-[250ms] ease" />
                            </a>

                            <a
                                href="https://github.com/"
                                target="_blank"
                                rel="noreferrer"
                                className="group/icon w-[44px] h-[44px] rounded-xl bg-subtleBg border border-subtleBorder grid place-items-center text-textMain no-underline transition-all duration-[250ms] ease hover:-translate-y-1 hover:bg-[rgba(255,215,0,0.18)] hover:border-[rgba(255,215,0,0.35)] hover:shadow-[0_14px_40px_rgba(255,215,0,0.18)] text-[18px]"
                                aria-label="GitHub"
                            >
                                <FaGithub className="transition-transform duration-[250ms] ease" />
                            </a>

                            <a
                                href="https://www.instagram.com/"
                                target="_blank"
                                rel="noreferrer"
                                className="group/icon w-[44px] h-[44px] rounded-xl bg-subtleBg border border-subtleBorder grid place-items-center text-textMain no-underline transition-all duration-[250ms] ease hover:-translate-y-1 hover:bg-[rgba(255,215,0,0.18)] hover:border-[rgba(255,215,0,0.35)] hover:shadow-[0_14px_40px_rgba(255,215,0,0.18)] text-[18px]"
                                aria-label="Instagram"
                            >
                                <FaInstagram className="transition-transform duration-[250ms] ease" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-col">
                        <h3 className="text-[1.1rem] text-textMain mb-6 font-[700]">Club</h3>
                        <ul className="list-none p-0 m-0">
                            <li className="mb-3"><Link to="/about" className="group text-textMuted no-underline text-[1rem] transition-all duration-300 ease inline-flex items-center hover:text-primary hover:translate-x-1">About Us</Link></li>
                            <li className="mb-3"><a href="/#highlights" className="group text-textMuted no-underline text-[1rem] transition-all duration-300 ease inline-flex items-center hover:text-primary hover:translate-x-1">Highlights</a></li>
                            <li className="mb-3"><a href="/#team" className="group text-textMuted no-underline text-[1rem] transition-all duration-300 ease inline-flex items-center hover:text-primary hover:translate-x-1">Our Team</a></li>
                            <li className="mb-3"><a href="/#contact-form" className="group text-textMuted no-underline text-[1rem] transition-all duration-300 ease inline-flex items-center hover:text-primary hover:translate-x-1">Contact</a></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="footer-col">
                        <h3 className="text-[1.1rem] text-textMain mb-6 font-[700]">Activities</h3>
                        <ul className="list-none p-0 m-0">
                            <li className="mb-3"><a href="/#challenges" className="group text-textMuted no-underline text-[1rem] transition-all duration-300 ease inline-flex items-center hover:text-primary hover:translate-x-1">Coding Challenges</a></li>
                            <li className="mb-3"><a href="/#highlights" className="group text-textMuted no-underline text-[1rem] transition-all duration-300 ease inline-flex items-center hover:text-primary hover:translate-x-1">Workshops</a></li>
                            <li className="mb-3"><a href="/#events" className="group text-textMuted no-underline text-[1rem] transition-all duration-300 ease inline-flex items-center hover:text-primary hover:translate-x-1">Hackathons</a></li>
                            <li className="mb-3"><a href="/#events" className="group text-textMuted no-underline text-[1rem] transition-all duration-300 ease inline-flex items-center hover:text-primary hover:translate-x-1">Projects</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-col">
                        <h3 className="text-[1.1rem] text-textMain mb-6 font-[700]">Contact</h3>
                        <ul className="list-none p-0 m-0">
                            <li className="mb-3">
                                <a href="mailto:csquareclub@gmail.com" className="group flex items-center gap-2.5 text-textMuted no-underline text-[1rem] transition-all duration-300 ease hover:text-primary">
                                    <HiOutlineMail className="text-[18px] text-primary shrink-0" />
                                    <span className="text-inherit transition-colors duration-300">csquareclub@gmail.com</span>
                                </a>
                            </li>

                            <li className="mb-3">
                                <span className="flex items-center gap-2.5 text-textMuted group text-[1rem]">
                                    <MdLocationOn className="text-[18px] text-primary shrink-0" />
                                    <span className="text-inherit transition-colors duration-300">Your College, City, India</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-glassBorder pt-[30px] flex flex-col sm:flex-row justify-between items-center gap-[20px] sm:gap-0 sm:text-left text-center relative z-10">
                    <p className="text-textMuted text-[0.9rem] m-0">
                        &copy; {new Date().getFullYear()} C-Square Coding Club. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#privacy" className="text-textMuted no-underline text-[0.9rem] transition-colors duration-300 ease hover:text-textMain">Privacy Policy</a>
                        <a href="#terms" className="text-textMuted no-underline text-[0.9rem] transition-colors duration-300 ease hover:text-textMain">Terms of Service</a>
                    </div>
                </div>

            </div>
        </footer>
    )
}

export default Footer
