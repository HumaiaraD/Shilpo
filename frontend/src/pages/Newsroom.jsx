import { Link } from 'react-router-dom'
import useFetch from '../components/useFetch';
import Train from '../components/Train';

const Newsroom = () => {

    const { items, loading, error } = useFetch("/api/exhibitions");

  return (
    <>
    <section className="text-center py-12 px-6">
        <h1 className="text-4xl font-serif mb-4">Newsroom</h1>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore a curated collection of art exhibitions, creative expressions,
            and inspiring stories. Discover unique artworks, connect with artistic
            perspectives, and celebrate the world of art.
        </p>
    </section>

    <main className="min-h-screen bg-[#faf9f6] p-8">
        <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-serif">Exhibitions</h1>
        </div>

        {loading && <p>Loading exhibitions...</p>}
        {error && <p>Failed to load exhibitions.</p>}

       <section className="grid gap-8">
            {items?.map((exhibition) => (
                <div
                key={exhibition.id}
                className="bg-white border border-neutral-200 flex flex-col md:flex-row"
                >
                <img
                    src={exhibition.cover_image_url}
                    alt={exhibition.title}
                    className="w-full md:w-1/3 h-64 object-cover"
                    onError={(e) => {
                    console.log("Image failed:", e.currentTarget.src);
                    }}
                />

                <div className="p-5 flex-1">
                    <h2 className="text-2xl font-serif mb-3">
                    {exhibition.title}
                    </h2>

                    <p className="text-gray-600 mb-3">
                    {exhibition.description}
                    </p>

                    <p className="text-sm text-gray-500">
                    {exhibition.start_date}
                    </p>

                    <p className="text-sm text-gray-500">
                    {exhibition.end_date}
                    </p>

                    <p className="text-sm text-gray-500">
                    {exhibition.location}
                    </p>

                    <p className="text-sm text-gray-500">
                    {exhibition.visiting_hours}
                    </p>
                </div>
                </div>
            ))}
        </section>
    </main>

    <section className=" mb-16 px-6 py-30 bg-stone-50 text-center">
        <p className="text-sm uppercase tracking-widest text-stone-500 mb-4">
            The Story Behind the Project
        </p>

        <h2 className="text-4xl font-serif text-stone-800 mb-6">
            How It All Began
        </h2>

        <p className="max-w-2xl mx-auto text-stone-600 leading-relaxed mb-8">
            Every creative project begins with an idea.
            Discover the inspiration, planning, and development
            process behind this platform, from its initial
            concept to the final experience.
        </p>

        <Link
            to="/about"
            className="inline-block border border-stone-700
                    px-8 py-3 text-stone-700
                    hover:bg-stone-800 hover:text-white
                    transition duration-300"
        >
            Explore the Project →
        </Link>
    </section>

    <Train />
            
    </>
  )
}

export default Newsroom