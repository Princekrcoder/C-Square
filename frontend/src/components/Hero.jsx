import { useEffect, useRef } from "react";
import customLogo from "../assets/yellow-logo.png";
import { Link } from "react-router-dom";

const Hero = () => {
  const editorRef = useRef(null);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    const codeLines = [
      "import { Skills } from '@csquare/core';",
      "",
      "const member = new ClubMember({",
      "  track: 'competitive-coding',",
      "  level: 'intermediate',",
      "  weeklyChallenge: true",
      "});",
      "",
      "// Submit this week's solution",
      "await member.submitSolution();",
      "console.log('Leaderboard Updated 🟢');",
    ];

    const editor = editorRef.current;
    if (!editor) return;

    let i = 0;
    let j = 0;
    let ran = false;

    const isMobile = window.innerWidth < 600;

    const TYPE_BASE = isMobile ? 45 : 70;
    const TYPE_RANDOM = isMobile ? 40 : 60;
    const LINE_DELAY = isMobile ? 130 : 190;
    const RESTART_DELAY = 2500;

    const addTimeout = (fn, delay) => {
      const id = setTimeout(fn, delay);
      timeoutsRef.current.push(id);
      return id;
    };

    const createCursor = () => {
      const existingCursor = editor.querySelector(".custom-cursor");
      if (existingCursor) existingCursor.remove();

      const cursor = document.createElement("span");
      cursor.className = "custom-cursor inline-block w-[2px] h-[16px] bg-accent ml-1 align-middle animate-pulse";
      return cursor;
    };

    const escapeHTML = (str) =>
      str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const highlightSyntax = (text) => {
      const safe = escapeHTML(text);

      return safe
        .replace(/(import|from|const|new|await)/g, '<span class="text-codeKeyword">$1</span>')
        .replace(/('[^']*')/g, '<span class="text-codeString">$1</span>')
        .replace(/\b(console|log)\b/g, '<span class="text-codeFunc">$1</span>')
        .replace(/(\/\/.*)/g, '<span style="color:#5c6370">$1</span>');
    };

    const typeEffect = () => {
      if (i >= codeLines.length) {
        if (isMobile && ran) return;
        ran = true;

        addTimeout(() => {
          editor.innerHTML = "";
          i = 0;
          j = 0;
          typeEffect();
        }, RESTART_DELAY);

        return;
      }

      let line = editor.children[i];
      if (!line) {
        line = document.createElement("div");
        line.className = "flex min-h-[22px]";
        line.innerHTML = `<span class="inline-block w-[30px] text-right mr-[15px] text-[#4b5563] shrink-0">${i + 1}</span><span class="whitespace-pre text-codePlain"></span>`;
        editor.appendChild(line);
      }

      const span = line.querySelector("span:nth-child(2)");
      const txt = codeLines[i];

      if (txt.length === 0) {
        span.innerHTML = "";
        i++;
        j = 0;
        addTimeout(typeEffect, LINE_DELAY);
        return;
      }

      if (j <= txt.length) {
        const partial = txt.slice(0, j);
        span.innerHTML = highlightSyntax(partial);
        span.appendChild(createCursor());

        j++;

        const delay = TYPE_BASE + Math.random() * TYPE_RANDOM;
        addTimeout(typeEffect, delay);
      } else {
        span.innerHTML = highlightSyntax(txt);
        j = 0;
        i++;
        addTimeout(typeEffect, LINE_DELAY);
      }
    };

    typeEffect();

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  return (
    <section className="min-h-[85vh] flex items-center justify-center px-6">
      <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center text-center lg:text-left">
        <div className="flex flex-col items-center lg:items-start">
          <img src={customLogo} alt="C-Square Logo" className="h-[100px] w-auto mb-6 drop-shadow-[10px_10px_30px_rgba(255,215,0,0.30)] transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-[3px] hover:scale-105 hover:drop-shadow-[0_0_20px_rgba(255,215,0,0.60)]" />
          <h1 className="text-[2.8rem] lg:text-[4rem] leading-[1.1] mb-6 text-textMain font-bold">
            Welcome to <br /><span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">C Square</span>
          </h1>
          <p className="max-w-[500px] mx-auto lg:mx-0 text-textMuted mb-[32px] lg:mb-[40px] text-lg">
            Your gateway to competitive coding and development.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link to="/login" className="px-8 py-[14px] rounded-xl no-underline font-semibold relative z-10 transition-all duration-[220ms] ease-out bg-primary text-[#111111] shadow-[0_8px_20px_var(--tw-shadow-color)] shadow-primaryGlow hover:-translate-y-1 hover:shadow-[0_14px_36px_var(--tw-shadow-color),0_0_0_2px_rgba(255,215,0,0.3)]">
              Become a Member
            </Link>
            <Link to="/events" className="px-8 py-[14px] rounded-xl no-underline font-semibold relative z-10 transition-all duration-[220ms] ease-out bg-glassBg border border-glassBorder text-textMain shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,0,0,0.4)] hover:border-primary">
              Explore Events
            </Link>
          </div>
        </div>

        <div className="hidden md:block w-full max-w-[520px] mx-auto lg:max-w-none [perspective:1000px]">
          <div className="bg-glassBg backdrop-blur-[20px] border border-glassBorder rounded-2xl overflow-hidden transition-transform duration-500 lg:[transform:rotateY(-5deg)_rotateX(2deg)] lg:hover:[transform:none] shadow-2xl">
            <div className="p-[12px_16px] flex gap-2 border-b border-subtleBorder bg-subtleBg">
              <div className="w-3 h-3 rounded-full inline-block bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full inline-block bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full inline-block bg-[#27c93f]"></div>
            </div>

            <div className="p-6 font-mono text-sm sm:text-base h-[320px] overflow-hidden text-left" ref={editorRef}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
