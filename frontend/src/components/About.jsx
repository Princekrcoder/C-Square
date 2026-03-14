import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SEO from './SEO';

const About = ({ theme, toggleTheme }) => {
  useEffect(() => {
    const observerOptions = { threshold: 0.2 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const rows = document.querySelectorAll('.service-row');
    rows.forEach(row => observer.observe(row));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SEO
        title="About Us | C-Square"
        description="Learn more about C-Square, our mission, vision, and how we empower students through competitive coding and technical workshops."
      />
      <div className="App">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>

        <Navbar theme={theme} toggleTheme={toggleTheme} />

        <section className="pt-[40px] px-6 pb-[100px] relative min-h-[70vh]">
          <div className="max-w-[900px] mx-auto text-center">
            <h1 className="text-[3rem] md:text-[4.5rem] font-[800] mb-6 text-textMain">
              About <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">C-Square</span>
            </h1>
            <p className="text-textMuted text-[1.15rem] leading-[1.8] mb-[60px]">
              We are a passionate community of developers, designers, and problem solvers dedicated to fostering a culture of innovation and continuous learning.
            </p>

            <div className="flex flex-col gap-8">
              <div className="bg-glassBg border border-glassBorder backdrop-blur-[18px] p-[40px] rounded-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-left transition-all duration-300 hover:-translate-y-2 hover:border-[rgba(255,215,0,0.3)] hover:shadow-primaryGlow">
                <h2 className="text-[2rem] font-bold text-textMain mb-4">Our Mission</h2>
                <p className="text-textMuted leading-[1.7] text-[1.1rem]">
                  Our mission is to bridge the gap between academic learning and industry requirements. We strive to provide members with hands-on experience in competitive coding, software development, and emerging technologies like AI/ML and Cloud Computing.
                </p>
              </div>

              <div className="bg-glassBg border border-glassBorder backdrop-blur-[18px] p-[40px] rounded-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-left transition-all duration-300 hover:-translate-y-2 hover:border-[rgba(255,215,0,0.3)] hover:shadow-primaryGlow">
                <h2 className="text-[2rem] font-bold text-textMain mb-4">What We Do</h2>
                <p className="text-textMuted leading-[1.7] text-[1.1rem]">
                  Through weekly coding challenges, expert-led workshops, and 24-48 hour hackathons, we equip our members with the skills necessary to excel in technical interviews and build impactful, real-world projects. We partner with industry leaders and alumni to offer unmatched networking and career readiness opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="pt-[80px] px-6 pb-[30px] relative" id="highlights">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center mb-[120px]">
              <h2 className="text-[3.2rem] font-[800] mb-5">What We <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Offer</span></h2>
              <p className="max-w-[640px] mx-auto text-textMuted text-[1.15rem] leading-[1.7]">
                Everything you need to grow as a coder — challenges, workshops,
                hackathons, and real-world projects under one community.
              </p>
            </div>

          
            <div className="flex flex-col md:flex-row items-center gap-[60px] md:gap-[100px] mb-[140px] text-center md:text-left opacity-0 translate-y-10 transition-all duration-700 ease-out service-row">
              <div className="flex-1">
                <h3 className="text-[2.6rem] mb-[18px]">Competitive <span className="text-primary">Coding</span></h3>
                <p className="text-textMuted leading-[1.8] text-[1.1rem] mb-8 max-w-[520px] mx-auto md:mx-0">
                  Sharpen your coding skills with our competitive coding challenges.
                </p>
                <ul className="list-none text-left inline-block md:block mx-auto">
                  <li className="flex items-center gap-3 mb-[14px] font-semibold before:content-['✔'] before:text-[#22c55e]">Weekly Coding Contests</li>
                  <li className="flex items-center gap-3 mb-[14px] font-semibold before:content-['✔'] before:text-[#22c55e]">LeetCode &amp; Codeforces Style Problems</li>
                  <li className="flex items-center gap-3 mb-[14px] font-semibold before:content-['✔'] before:text-[#22c55e]">Leaderboard &amp; Rating System</li>
                </ul>
              </div>

              <div className="flex-1 w-full relative">
                <div className="bg-glassBg backdrop-blur-[18px] border border-glassBorder rounded-2xl p-9 font-mono text-[#93c5fd] shadow-[0_20px_60px_rgba(0,0,0,0.35)] text-left overflow-x-auto text-sm md:text-base">
                  <pre>{`// Weekly Challenge #42
                        function maxSubarray(nums) {
                          let max = -Infinity, cur = 0;
                          for (let n of nums) {
                            cur = Math.max(n, cur + n);
                            max = Math.max(max, cur);
                          }
                          return max; // ✅ Solved!
                        }`}</pre>
                </div>
              </div>
            </div>

          </div>
        </section> */}

        <Footer />
      </div>
    </>
  );
};

export default About;
