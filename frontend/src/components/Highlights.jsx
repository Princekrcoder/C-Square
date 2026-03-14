import React, { useEffect } from 'react';

const Highlights = () => {
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
    <section className="pt-[140px] px-6 pb-[30px] relative" id="highlights">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-[120px]">
          <h2 className="text-[3.2rem] font-[800] mb-5">What We <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Offer</span></h2>
          <p className="max-w-[640px] mx-auto text-textMuted text-[1.15rem] leading-[1.7]">
            Everything you need to grow as a coder — challenges, workshops,
            hackathons, and real-world projects under one community.
          </p>
        </div>

        {/* Highlight 2 - Technical Workshops */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-[60px] md:gap-[100px] mb-[140px] text-center md:text-left opacity-0 translate-y-10 transition-all duration-700 ease-out service-row">
          <div className="flex-1">
            <h3 className="text-[2.6rem] mb-[18px]">Technical <span className="text-primary">Workshops</span></h3>
            <p className="text-textMuted leading-[1.8] text-[1.1rem] mb-8 max-w-[520px] mx-auto md:mx-0">
              Learn new technologies and tools in our interactive workshops.
            </p>
            <ul className="list-none text-left inline-block md:block mx-auto">
              <li className="flex items-center gap-3 mb-[14px] font-semibold before:content-['✔'] before:text-[#22c55e]">Expert-Led Sessions</li>
              <li className="flex items-center gap-3 mb-[14px] font-semibold before:content-['✔'] before:text-[#22c55e]">Recorded &amp; Available On-Demand</li>
              <li className="flex items-center gap-3 mb-[14px] font-semibold before:content-['✔'] before:text-[#22c55e]">Participation Certificates</li>
            </ul>
          </div>

          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 gap-[22px]">
              <div className="bg-glassBg border border-glassBorder p-8 rounded-[18px] text-center font-semibold transition-all duration-350 ease shadow-[0_12px_35px_rgba(0,0,0,0.25)] hover:-translate-y-[6px] hover:bg-primary hover:text-[#111111] hover:shadow-[0_25px_55px_var(--tw-shadow-color)] hover:shadow-primaryGlow cursor-default">Web Dev</div>
              <div className="bg-glassBg border border-glassBorder p-8 rounded-[18px] text-center font-semibold transition-all duration-350 ease shadow-[0_12px_35px_rgba(0,0,0,0.25)] hover:-translate-y-[6px] hover:bg-primary hover:text-[#111111] hover:shadow-[0_25px_55px_var(--tw-shadow-color)] hover:shadow-primaryGlow cursor-default">DSA</div>
              <div className="bg-glassBg border border-glassBorder p-8 rounded-[18px] text-center font-semibold transition-all duration-350 ease shadow-[0_12px_35px_rgba(0,0,0,0.25)] hover:-translate-y-[6px] hover:bg-primary hover:text-[#111111] hover:shadow-[0_25px_55px_var(--tw-shadow-color)] hover:shadow-primaryGlow cursor-default">AI / ML</div>
              <div className="bg-glassBg border border-glassBorder p-8 rounded-[18px] text-center font-semibold transition-all duration-350 ease shadow-[0_12px_35px_rgba(0,0,0,0.25)] hover:-translate-y-[6px] hover:bg-primary hover:text-[#111111] hover:shadow-[0_25px_55px_var(--tw-shadow-color)] hover:shadow-primaryGlow cursor-default">DevOps</div>
            </div>
          </div>
        </div>

        {/* Highlight 3 - Hackathons & Projects */}
        <div className="flex flex-col md:flex-row items-center gap-[60px] md:gap-[100px] mb-[140px] text-center md:text-left opacity-0 translate-y-10 transition-all duration-700 ease-out service-row">
          <div className="flex-1">
            <h3 className="text-[2.6rem] mb-[18px]">Hackathons &amp; <span className="text-primary">Projects</span></h3>
            <p className="text-textMuted leading-[1.8] text-[1.1rem] mb-8 max-w-[520px] mx-auto md:mx-0">
              Compete in hackathons and build innovative solutions.
            </p>
            <ul className="list-none text-left inline-block md:block mx-auto">
              <li className="flex items-center gap-3 mb-[14px] font-semibold before:content-['✔'] before:text-[#22c55e]">Team-Based Hackathons</li>
              <li className="flex items-center gap-3 mb-[14px] font-semibold before:content-['✔'] before:text-[#22c55e]">Open Source Contributions</li>
              <li className="flex items-center gap-3 mb-[14px] font-semibold before:content-['✔'] before:text-[#22c55e]">Real Portfolio Projects</li>
            </ul>
          </div>

          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 gap-[22px]">
              <div className="bg-glassBg border border-glassBorder p-8 rounded-[18px] text-center font-semibold transition-all duration-350 ease shadow-[0_12px_35px_rgba(0,0,0,0.25)] hover:-translate-y-[6px] hover:bg-primary hover:text-[#111111] hover:shadow-[0_25px_55px_var(--tw-shadow-color)] hover:shadow-primaryGlow cursor-default">Hackathon</div>
              <div className="bg-glassBg border border-glassBorder p-8 rounded-[18px] text-center font-semibold transition-all duration-350 ease shadow-[0_12px_35px_rgba(0,0,0,0.25)] hover:-translate-y-[6px] hover:bg-primary hover:text-[#111111] hover:shadow-[0_25px_55px_var(--tw-shadow-color)] hover:shadow-primaryGlow cursor-default">GitHub</div>
              <div className="bg-glassBg border border-glassBorder p-8 rounded-[18px] text-center font-semibold transition-all duration-350 ease shadow-[0_12px_35px_rgba(0,0,0,0.25)] hover:-translate-y-[6px] hover:bg-primary hover:text-[#111111] hover:shadow-[0_25px_55px_var(--tw-shadow-color)] hover:shadow-primaryGlow cursor-default">Projects</div>
              <div className="bg-glassBg border border-glassBorder p-8 rounded-[18px] text-center font-semibold transition-all duration-350 ease shadow-[0_12px_35px_rgba(0,0,0,0.25)] hover:-translate-y-[6px] hover:bg-primary hover:text-[#111111] hover:shadow-[0_25px_55px_var(--tw-shadow-color)] hover:shadow-primaryGlow cursor-default">Prizes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Highlights;