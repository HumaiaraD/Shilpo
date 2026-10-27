import { Link } from 'react-router-dom'
import useFetch from '../components/useFetch';

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
            <h1 className="text-4xl font-serif">Newsroom</h1>

            <Link
            to="/newsroom/create"
            className="bg-black text-white px-5 py-3"
            >
            + Create Exhibition
            </Link>
        </div>

        {loading && <p>Loading exhibitions...</p>}
        {error && <p>Failed to load exhibitions.</p>}

        <section className="grid  gap-8">
            {items?.map((exhibition) => (
            <div
                key={exhibition.id}
                className="bg-white border border-neutral-200"
            >
                <img
                src={exhibition.image_url}
                alt={exhibition.title}
                className="w-full h-64 object-cover"
                />

                <div className="p-5">
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
    
    </>
  )
}

export default Newsroom