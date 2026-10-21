import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const images = [
  "/wheel/1.jpg",
  "/wheel/2.jpg",
  "/wheel/3.jpg",
  "/wheel/4.jpg",
  "/wheel/5.jpeg",
  "/wheel/6.jpg",
  "/wheel/7.jpg",
  "/wheel/8.jpg",
  "/wheel/9.webp",
];

function Home() {
  const heroRef = useRef(null);
  const wheelRef = useRef(null);

  const revealRef = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.to(wheelRef.current, {
        rotation: 360,
        duration: 40,
        repeat: -1,
        ease: "none",
      });
    },
    { scope: heroRef },
  );

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.from(".reveal-text", {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: revealRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: revealRef },
  );

  return (
    <>
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-stone-100 pt-16 text-stone-800"
      >
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <p className="mb-4 text-sm uppercase tracking-widest">
            A Space for Artists and Their Art
          </p>

          <h1 className="text-5xl sm:text-7xl">Art deserves a space.</h1>

          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed">
            Discover creative work and bring your own artists, collections, and
            artworks together.
          </p>

          <Link
            to="/artwork"
            className="mt-6 inline-block rounded-full bg-stone-800 px-6 py-3 text-base text-white hover:bg-stone-700"
          >
            Explore Art
          </Link>
        </div>

        <div className="mt-12 overflow-hidden">
          <div className="relative left-[25vw] w-fit">
            <div
              ref={wheelRef}
              className="relative aspect-square w-[90vw] max-w-[1200px] shrink-0"
            >
              <div className="absolute inset-[15%] rounded-full border border-stone-300" />

              {images.map((image, index) => {
                const angle = (index / images.length) * 360;
                const radians = (angle * Math.PI) / 180;

                return (
                  <div
                    key={image}
                    className="absolute w-[14%]"
                    style={{
                      left: `${50 + Math.cos(radians) * 35}%`,
                      top: `${50 + Math.sin(radians) * 35}%`,
                      transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
                    }}
                  >
                    <img
                      src={image}
                      alt={`Featured artwork ${index + 1}`}
                      className="aspect-3/4 w-full rounded-xl object-cover shadow-lg"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        ref={revealRef}
        className="mx-auto max-w-4xl px-6 py-24 text-center text-stone-800"
      >
        <p className="reveal-text mb-4 text-sm uppercase tracking-widest">
          Create. Collect. Connect.
        </p>

        <h2 className="reveal-text text-4xl sm:text-6xl">
          Every artwork has a story. Give yours a place to live.
        </h2>

        <p className="reveal-text mx-auto mt-6 max-w-xl text-base leading-relaxed">
          Bring your artists, collections, and artworks together. Build a
          portfolio that grows with your creativity.
        </p>

        <div className="reveal-text mt-8">
          <Link
            to="/user"
            className="inline-block rounded-full bg-stone-800 px-6 py-3 text-base text-white"
          >
            Start Your Portfolio
          </Link>
        </div>
      </section>
      <section className="bg-stone-100 px-6 py-20 text-stone-800">
        <div className="mx-auto max-w-5xl">
          <header className="mb-10 text-center">
            <p className="mb-3 text-sm uppercase tracking-widest">
              Behind the Project
            </p>
            <h2 className="text-4xl sm:text-5xl">How Shilpo Works</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed">
              Shilpo connects an interactive React frontend to a Flask API and
              PostgreSQL database, bringing portfolio browsing and management
              into one application.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <article className="rounded-2xl bg-white p-6">
              <h3 className="mb-3 text-2xl">The Interface</h3>
              <p className="text-base leading-relaxed text-stone-600">
                React and TailwindCSS power responsive pages, searchable artwork
                cards, and reusable forms for adding and editing portfolio
                records. GSAP adds motion to the homepage.
              </p>
            </article>

            <article className="rounded-2xl bg-white p-6">
              <h3 className="mb-3 text-2xl">Connected Data</h3>
              <p className="text-base leading-relaxed text-stone-600">
                Flask handles REST API requests, while SQLAlchemy connects
                artists, collections, and artworks in PostgreSQL. Changes are
                saved in the database and reflected in the interface.
              </p>
            </article>

            <article className="rounded-2xl bg-white p-6">
              <h3 className="mb-3 text-2xl">Accounts & Ownership</h3>
              <p className="text-base leading-relaxed text-stone-600">
                Session-based authentication supports signup, login, and logout.
                Passwords are hashed with Bcrypt, and backend ownership checks
                restrict changes to each user’s own records.
              </p>
            </article>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/about"
              className="text-base underline underline-offset-4 hover:text-stone-500"
            >
              Meet the Creator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
