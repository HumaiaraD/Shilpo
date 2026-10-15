import React from 'react'

const About = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-stone-700">
      <header className="mb-12 text-center">
        <p className="text-sm uppercase tracking-widest">
          A Space for Artists and Their Art
        </p>
        <h1 className="mt-3 text-5xl">About Shilpo</h1>
      </header>

      <div className="space-y-10">
        <section>
          <h2 className="mb-3 text-3xl">Art, organized.</h2>
          <p className="text-base leading-relaxed">
            Shilpo brings artists, collections, and artworks together in
            one place. It helps artists and small collection managers
            spend less time searching through folders and spreadsheets
            and more time focusing on their work.
          </p>
          <p className="mt-4 text-base leading-relaxed">
            Visitors can explore the artwork gallery, while registered
            users can create and manage their own artist profiles,
            collections, and artworks.
          </p>
        </section>

        <section className="border-t border-stone-200 pt-8">
          <h2 className="mb-3 text-3xl">Meet the Creator</h2>
          <p className="text-base leading-relaxed">
            Hi, I’m Humaiara Diea, a self-taught artist exploring the
            connection between art, design, and code. Creating an art
            portfolio sparked my interest in web development, and Shilpo
            brings those interests together.
          </p>
          <p className="mt-4 text-base leading-relaxed">
            I built Shilpo as a full-stack capstone project using React,
            TailwindCSS, Flask, and PostgreSQL.
          </p>
          <p>For more details about this project. Check out my github repo for Shilpo.</p>
          <a href="https://github.com/HumaiaraD/Shilpo" className='text-gray-400'>github link</a>
        </section>

        <section className="flex flex-col border-t border-stone-200 pt-8">
          <h2 className="mb-3 text-3xl">Get in Touch</h2>
          <p className="text-base leading-relaxed">
            Have a question, feedback, or an idea for a collaboration?
            I’d love to hear from you.
          </p>

          {/* Replace with your email address */}
          <a
            href="mailto:d.humaiara@gmail.com"
            className="mt-4 inline-block text-base underline underline-offset-4 hover:text-stone-950"
          >
            Email me
          </a>
          <a href="https://www.humaiaradiea.com/" target='_blank' className='underline underline-offset-4'>My Portfolio Website</a>
          <a href="https://github.com/HumaiaraD" target='_blank' className='underline underline-offset-4'>My github</a>
        </section>
      </div>
    </main>
  );
}

export default About;