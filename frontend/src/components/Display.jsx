

const Display = ({ artwork, collection, artist, onClose }) => {
  if (!artwork) return null;

  return (
    <aside
      aria-label="Artwork details"
      className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto border-l border-stone-200 bg-white p-6 text-stone-800 shadow-2xl sm:max-w-lg"
    >
      <button
        type="button"
        onClick={onClose}
        className="mb-6 rounded-lg border border-stone-300 px-4 py-2 hover:bg-stone-100"
      >
        Close
      </button>

      {artwork.image_url && (
        <img
          src={artwork.image_url}
          alt={artwork.title}
          className="max-h-[55vh] w-full rounded-xl object-contain"
        />
      )}

      <h2 className="mt-6 text-3xl">{artwork.title}</h2>

      <dl className="mt-5 space-y-4 text-base">
        <div>
          <dt className="font-semibold">Artist</dt>
          <dd>{artist?.name ?? "Unknown artist"}</dd>
        </div>

        <div>
          <dt className="font-semibold">Collection</dt>
          <dd>{collection?.title ?? "Unknown collection"}</dd>
        </div>

        <div>
          <dt className="font-semibold">Medium</dt>
          <dd>{artwork.medium || "Not specified"}</dd>
        </div>

        <div>
          <dt className="font-semibold">Description</dt>
          <dd className="whitespace-pre-wrap leading-relaxed">
            {artwork.description || "No description provided."}
          </dd>
        </div>
      </dl>
    </aside>
  );
}

export default Display;