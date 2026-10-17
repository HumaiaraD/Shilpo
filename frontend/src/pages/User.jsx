import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useFetch from "../components/useFetch";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

function User({ user, setUser }) {
    const navigate = useNavigate();

    const { items: artists, loading: artistsLoading, error: artistsError } =
    useFetch("https://shilpo-api.onrender.com/artists");

    const {
    items: collections,
    loading: collectionsLoading,
    error: collectionsError,
    } = useFetch("https://shilpo-api.onrender.com/collections");

    const { items: artworks, loading: artworksLoading, error: artworksError } =
    useFetch("https://shilpo-api.onrender.com/artworks");

    const myArtists = artists.filter(
    (artist) => artist.user_id === user?.id
    );

    const myCollections = collections.filter((collection) =>
    myArtists.some((artist) => artist.id === collection.artist_id)
    );

    const myArtworks = artworks.filter((artwork) =>
    myCollections.some(
        (collection) => collection.id === artwork.collection_id
    )
    );

    const loading = artistsLoading || collectionsLoading || artworksLoading;
    const error = artistsError || collectionsError || artworksError;

    async function handleLogout() {
        try {
        const response = await fetch("https://shilpo-api.onrender.com/logout", {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Logout failed.");
        }

        setUser(null);
        navigate("/user");
        } catch (err) {
        alert(err.message);
        }
    }

    const headerRef = useRef(null);

useGSAP(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  gsap.to(".floating-art", {
    y: -20,
    rotation: (index) => (index % 2 === 0 ? 4 : -4),
    duration: 2.5,
    stagger: 0.4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}, { scope: headerRef });
  return (
    <>
        <header
  ref={headerRef}
  className="overflow-hidden bg-stone-100 px-6 py-12 text-stone-800"
>
  <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
    <div>
      <p className="mb-3 text-xs uppercase tracking-[0.2em]">
        Your Creative Space
      </p>

      <h1 className="text-4xl sm:text-6xl">
        {user ? `Welcome, ${user.username}` : "A home for your art."}
      </h1>

      <p className="mt-5 max-w-md text-base leading-relaxed text-stone-600">
        Collect your ideas. Organize your work. Keep creating.
      </p>
    </div>

    <div className="relative mx-auto h-80 w-full max-w-md">
      <div className="absolute left-[5%] top-12 w-[36%] -rotate-12">
        <img
          src="/wheel/1.jpg"
          alt="Featured artwork"
          className="floating-art aspect-3/4 w-full rounded-xl border-8 border-white object-cover shadow-xl"
        />
      </div>

      <div className="absolute right-[5%] top-8 w-[36%] rotate-12">
        <img
          src="/wheel/2.jpg"
          alt="Featured artwork"
          className="floating-art aspect-3/4 w-full rounded-xl border-8 border-white object-cover shadow-xl"
        />
      </div>

      <div className="absolute left-[32%] top-20 z-10 w-[36%]">
        <img
          src="/wheel/3.jpg"
          alt="Featured artwork"
          className="floating-art aspect-3/4 w-full rounded-xl border-8 border-white object-cover shadow-xl"
        />
      </div>
    </div>
  </div>
</header>
    
        <section className="max-w-sm mx-auto my-10 text-center">
        <h1 className="text-xl mb-6">My Account</h1>

        {user ? (
            <div className="flex flex-col">
            <p className="mb-4 text-3xl">Welcome, {user.username}!</p>
            <Link to="/admin" className="text-2xl m-2 underline hover:text-gray-400">Create/Edit Portfolio</Link>
            <button type="button" onClick={handleLogout} className="m-2 underline hover:text-gray-400">
                Logout
            </button>
            </div>
        ) : (
            <div className="flex justify-center gap-6">
            <Link to="/login" className="border-2 border-black rounded-3xl px-6 py-2">Login</Link>
            <Link to="/signup" className="border-2 border-black rounded-3xl px-6 py-2">Signup</Link>
            </div>
        )}
        </section>

    {user && (
    <section className="max-w-6xl mx-auto px-4 pb-10">
        <h2 className="text-3xl mb-4">My Artworks</h2>

        {loading ? (
        <p>Loading your portfolio...</p>
        ) : error ? (
        <p className="text-red-600">{error.message}</p>
        ) : (
        <>
            <p className="mb-6">
            {myArtists.length} artists · {myCollections.length} collections ·{" "}
            {myArtworks.length} artworks
            </p>

            {myArtworks.length === 0 && (
            <p>No artworks yet. Open Manage Portfolio to add your work.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myArtworks.map((artwork) => {
                const collection = myCollections.find(
                (collection) => collection.id === artwork.collection_id
                );

                const artist = myArtists.find(
                (artist) => artist.id === collection?.artist_id
                );

                return (
                <article
                    key={artwork.id}
                    className="overflow-hidden rounded-2xl border border-stone-200"
                >
                    {artwork.image_url && (
                    <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="w-full h-64 object-cover"
                    />
                    )}

                    <div className="p-4">
                    <h3 className="text-2xl">{artwork.title}</h3>
                    <p>Artist: {artist?.name}</p>
                    <p>Collection: {collection?.title}</p>
                    <p>{artwork.medium}</p>
                    </div>
                </article>
                );
            })}
            </div>
        </>
        )}
    </section>
    )}
    </>
    );
}

export default User;