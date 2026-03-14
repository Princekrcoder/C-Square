import React, { useEffect, useRef } from "react";

export default function OurProcessTimeline() {
    const containerRef = useRef(null);

    useEffect(() => {
        const observerOptions = { threshold: 0.3 };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("opacity-100", "translate-y-0");
                    entry.target.classList.remove("opacity-0", "translate-y-[50px]");
                }
            });
        }, observerOptions);

        const items = containerRef.current?.querySelectorAll(".process-timeline-item");
        items?.forEach((item) => observer.observe(item));

        return () => {
            items?.forEach((item) => observer.unobserve(item));
            observer.disconnect();
        };
    }, []);

    const timelineItems = [
        {
            tag: "STEP 01 — SIGN UP",
            title: "Create your account",
            desc: "Register on the C-Square portal using your college email to unlock access to all events, challenges, and resources.",
            points: ["Quick & free registration", "College email required", "Instant access to resources"]
        },
        {
            tag: "STEP 02 — EXPLORE",
            title: "Browse events & learning tracks",
            desc: "Discover upcoming workshops, coding contests, hackathons, and pick the learning track that matches your goals.",
            points: ["DSA, Web Dev, AI/ML tracks", "Upcoming event calendar", "Workshop recordings library"]
        },
        {
            tag: "STEP 03 — PARTICIPATE",
            title: "Join challenges & workshops",
            desc: "Attempt weekly coding challenges, attend live workshops, and build your skills through consistent practice.",
            points: ["Weekly rated challenges", "Live workshop sessions", "Earn participation certificates"]
        },
        {
            tag: "STEP 04 — COLLABORATE",
            title: "Build projects with teammates",
            desc: "Form teams, participate in hackathons, contribute to open-source projects, and build things that matter for your portfolio.",
            points: ["Team-based hackathons", "Open source contributions", "GitHub project portfolio"]
        },
        {
            tag: "STEP 05 — GROW",
            title: "Track your progress & get career ready",
            desc: "Climb the leaderboard, collect certificates, access interview prep resources, and get referrals from alumni at top companies.",
            points: ["Leaderboard & rating system", "Interview prep resources", "Alumni network & referrals"]
        }
    ];

    return (
        <section className="text-textMain relative">
            <div className="max-w-[1100px] mx-auto my-[100px] px-5" ref={containerRef}>
                <h1 className="text-center font-sans text-[2.5rem] md:text-[3rem] font-[800] mb-[80px] bg-gradient-to-b from-textMain from-30% to-textMuted bg-clip-text text-transparent">
                    How to Get Started
                </h1>
                <p className="text-center max-w-[720px] -mt-[55px] mx-auto mb-[70px] text-textDim text-[1rem] leading-[1.7]">
                    Joining C-Square is simple. Follow these steps and start your coding journey with our community today.
                </p>

                <div className="relative before:content-[''] before:absolute before:left-[30px] md:before:left-1/2 before:-translate-x-1/2 before:w-[2px] before:h-full before:bg-gradient-to-b before:from-transparent before:via-accent before:to-transparent">
                    {timelineItems.map((item, index) => (
                        <div key={index} className="process-timeline-item flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-[60px] md:mb-[100px] opacity-0 translate-y-[50px] transition-all duration-[800ms] ease-[cubic-bezier(0.2,1,0.3,1)] relative odd:flex-row md:even:flex-row-reverse">
                            <div className="w-[calc(100%-60px)] ml-[60px] md:w-[42%] md:ml-0 p-[30px] bg-cardBg border border-subtleBorder rounded-[20px] relative backdrop-blur-[10px] transition-all duration-300 ease-in-out hover:scale-[1.03] hover:border-accent hover:shadow-[0_0_22px_rgba(0,216,255,0.22)]">
                                <span className="text-[0.78rem] font-[800] text-accent uppercase tracking-[2px] mb-[10px] block">
                                    {item.tag}
                                </span>
                                <h3 className="font-sans text-[1.5rem] font-bold my-[10px] text-textMain">
                                    {item.title}
                                </h3>
                                <p className="text-textDim leading-[1.7] text-[0.95rem] m-0">
                                    {item.desc}
                                </p>
                                <ul className="mt-[14px] pl-[16px] text-textMuted text-[0.92rem] leading-[1.6] list-disc">
                                    {item.points.map((point, i) => (
                                        <li key={i}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="absolute left-[30px] md:left-1/2 -translate-x-1/2 w-[12px] h-[12px] bg-bgTech border-[3px] border-accent rounded-full z-10 shadow-[0_0_15px_var(--tw-shadow-color)] shadow-accent"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
