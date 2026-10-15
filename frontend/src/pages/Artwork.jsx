import { useState } from "react";
import useFetch from "../components/useFetch";
import Search from "../components/Search"

function Artwork() {

  const {
    items: artists,
    loading: artistsLoading,
    error: artistsError,
  } = useFetch("http://localhost:5555/artists");

  const {
    items: collections,
    loading: collectionsLoading,
    error: collectionsError,
  } = useFetch("http://localhost:5555/collections");

  const {
    items: artworks,
    loading: artworksLoading,
    error: artworksError,
  } = useFetch("http://localhost:5555/artworks");

  const error = artistsError || collectionsError || artworksError;

  const [ search, setSearch ] = useState("");

  const filteredArtworks = artworks.filter((artwork) => {
    const collection = collections.find(
      (collection) => collection.id === artwork.collection_id
    );

    const artist = artists.find(
      (artist) => artist.id === collection?.artist_id
    );

    const text = [
      artwork.title,
      artist?.name,
      collection?.title,
    ].join(" ").toLowerCase();

    return text.includes(search.trim().toLowerCase());
  });


  if (artistsLoading || collectionsLoading || artworksLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error.message}</p>;
  }

  return (
  <main className="max-w-6xl mx-auto px-4 py-10">
    <h1 className="text-4xl text-center mb-8">Explore Art</h1>

    {artworks.length === 0 && <p>No artworks yet.</p>}

    <div className="mb-6">
      <Search search={search} setSearch={setSearch} />
    </div>

    {artworks.length > 0 && filteredArtworks.length === 0 && (
      <p>No matching artworks found.</p>
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredArtworks.map((artwork) => {
        const collection = collections.find(
          (collection) => collection.id === artwork.collection_id
        );

        const artist = artists.find(
          (artist) => artist.id === collection?.artist_id
        );

        return (
          <article
            key={artwork.id}
            className="overflow-hidden rounded-2xl border border-stone-200"
          >
            {artwork.image_url ? (
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="w-full h-72 object-cover"
              />
            ) : (
              <div className="h-72 bg-stone-100 flex items-center justify-center">
                No image
              </div>
            )}

            <div className="p-5">
              <h2 className="text-2xl mb-2">{artwork.title}</h2>
              <p>Artist: {artist?.name ?? "Unknown artist"}</p>
              <p>Collection: {collection?.title ?? "Unknown collection"}</p>
              <p>Medium: {artwork.medium || "Not specified"}</p>
              <p className="mt-3">{artwork.description}</p>
            </div>
          </article>
        );
      })}
    </div>
  </main>
);
}

export default Artwork;