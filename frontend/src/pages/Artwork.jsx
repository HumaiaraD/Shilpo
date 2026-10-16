import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import useFetch from "../components/useFetch";
import Search from "../components/Search";
import Display from "../components/Display";

gsap.registerPlugin(Draggable);

function Artwork() {
  const [search, setSearch] = useState("");
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [page, setPage] = useState(1);

  const viewportRef = useRef(null);
  const gridRef = useRef(null);
  const lastButtonRef = useRef(null);

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
    pagination,
  } = useFetch("http://localhost:5555/artworks", page, 12);

  const loading =
    artistsLoading || collectionsLoading || artworksLoading;

  const error = artistsError || collectionsError || artworksError;

  const filteredArtworks = artworks.filter((artwork) => {
    const collection = collections.find(
      (item) => item.id === artwork.collection_id
    );

    const artist = artists.find(
      (item) => item.id === collection?.artist_id
    );

    return [
      artwork.title,
      artwork.medium,
      collection?.title,
      artist?.name,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase());
  });

  const columns = [0, 1, 2, 3].map((columnIndex) =>
    filteredArtworks.filter((_, index) => index % 4 === columnIndex)
  );

  // Reinitialize only when the displayed records change.
  const galleryKey = JSON.stringify(
    filteredArtworks.map((artwork) => artwork.id)
  );

  useEffect(() => {
    if (loading || error || !gridRef.current) return;

    const grid = gridRef.current;
    const viewport = viewportRef.current;

    let draggable;
    let resizeObserver;

    const ctx = gsap.context(() => {
      function centerGrid() {
        gsap.set(grid, {
          x: (viewport.clientWidth - grid.offsetWidth) / 2,
          y: (viewport.clientHeight - grid.offsetHeight) / 2,
        });
      }

      centerGrid();

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!reducedMotion) {
        gsap.from(".art-card", {
          opacity: 0,
          scale: 0.8,
          duration: 0.7,
          stagger: { amount: 0.6, from: "random" },
          ease: "power3.out",
        });
      }

      draggable = Draggable.create(grid, {
        type: "x,y",
        bounds: viewport,
        edgeResistance: 0.85,
        minimumMovement: 8,
        dragClickables: true,
        cursor: "grab",
        activeCursor: "grabbing",
      })[0];

      resizeObserver = new ResizeObserver(() => {
        draggable.applyBounds(viewport);
      });

      resizeObserver.observe(viewport);
    }, viewport);

    return () => {
      resizeObserver?.disconnect();
      draggable?.kill();
      ctx.revert();
    };
  }, [loading, error, galleryKey]);

  function openDetails(artwork, event) {
    // Ignore clicks immediately following a drag.
    if (Draggable.get(gridRef.current)?.timeSinceDrag() < 0.2) {
      return;
    }

    lastButtonRef.current = event.currentTarget;
    setSelectedArtwork(artwork);
  }

  function closeDetails() {
    setSelectedArtwork(null);
    lastButtonRef.current?.focus({ preventScroll: true });
  }

  const selectedCollection = collections.find(
    (collection) => collection.id === selectedArtwork?.collection_id
  );

  const selectedArtist = artists.find(
    (artist) => artist.id === selectedCollection?.artist_id
  );

  if (loading) {
    return <p className="py-20 text-center">Loading artworks...</p>;
  }

  if (error) {
    return (
      <p className="py-20 text-center text-red-600">
        {error.message}
      </p>
    );
  }

  return (
    <>
    <main className="py-2 text-stone-800">
      <header className="px-4 text-center flex justify-between">
        <div>
          <h1 className="text-2xl sm:text-xl">Explore Art</h1>
          <p className="mb-2 text-sm text-stone-500">
            Drag to explore · Click an artwork for details
          </p>
        </div>

        <div className=" flex justify-center">
          <Search search={search} setSearch={setSearch} />
        </div>
      </header>

      {filteredArtworks.length === 0 ? (
        <p className="py-16 text-center">No artworks found.</p>
      ) : (
        <div
          ref={viewportRef}
          className="relative isolate z-0 mx-2 h-[120vh] min-h-200 overflow-hidden rounded-3xl bg-stone-100"
        >
          <div
            ref={gridRef}
            className="absolute left-0 top-0 flex w-max items-start gap-8 p-10 sm:gap-16"
          >
            {columns.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className={`flex flex-col gap-10 ${
                  columnIndex % 2 ? "pt-20" : ""
                }`}
              >
                {column.map((artwork) => (
                  <button
                    key={artwork.id}
                    type="button"
                    onClick={(event) => openDetails(artwork, event)}
                    aria-label={`View details for ${artwork.title}`}
                    className="art-card w-45 text-left focus-visible:outline-2 focus-visible:outline-offset-4 sm:w-60"
                  >
                    <div className="aspect-square overflow-hidden rounded-xl bg-white shadow-sm">
                      {artwork.image_url ? (
                        <img
                          src={artwork.image_url}
                          alt={artwork.title}
                          draggable={false}
                          className="pointer-events-none h-full w-full select-none object-contain p-3"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm">
                          No image
                        </div>
                      )}
                    </div>

                    <h2 className="mt-3 text-lg">{artwork.title}</h2>
                    

                    {artwork.medium && (
                      <p className="mt-1 text-sm text-stone-500">
                        {artwork.medium}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedArtwork && (
        <Display
          artwork={selectedArtwork}
          collection={selectedCollection}
          artist={selectedArtist}
          onClose={closeDetails}
        />
      )}
    </main>

    {pagination && (
      <nav
        aria-label="Artwork pagination"
        className="my-2 flex items-center justify-center gap-4 text-base"
      >
        <button
          type="button"
          disabled={artworksLoading || !pagination.hasPrev}
          onClick={() => setPage((current) => current - 1)}
          className="rounded-lg text-sm border px-4 py-2 disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-sm">
          Page {pagination.page} of {pagination.totalPages || 1}
        </span>

        <button
          type="button"
          disabled={artworksLoading || !pagination.hasNext}
          onClick={() => setPage((current) => current + 1)}
          className="rounded-lg text-sm border px-4 py-2 disabled:opacity-40"
        >
          Next
        </button>
      </nav>
    )}
    </>
  );
}

export default Artwork;