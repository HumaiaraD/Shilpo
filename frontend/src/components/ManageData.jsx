const ManageData = ({
  artists,
  collections,
  artworks,
  handleEditArtist,
  handleDeleteArtist,
  handleEditCollection,
  handleDeleteCollection,
  handleEditArtwork,
  handleDeleteArtwork,
}) => {
  const editButton =
    "rounded-lg bg-stone-100 px-4 py-2 text-sm text-stone-700 hover:bg-stone-200";

  const deleteButton =
    "rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 hover:bg-red-100";

  return (
    <section className="w-full max-w-6xl mx-auto my-10 px-4">
      <h2 className="text-3xl font-lavishly font-bold text-stone-700 mb-8 text-center">
        Manage Portfolio
      </h2>

      {artists.length === 0 && (
        <p className="text-center text-stone-500">
          No artists yet. Add an artist to start your portfolio.
        </p>
      )}

      <div className="space-y-8">
        {artists.map((artist) => {
          const artistCollections = collections.filter(
            (collection) => collection.artist_id === artist.id,
          );

          return (
            <article
              key={artist.id}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white text-stone-800 shadow-sm"
            >
              {/* Artist details and actions */}
              <header className="flex flex-col gap-4 border-b border-stone-200 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="mb-1 text-xs uppercase tracking-widest text-stone-500">
                    Artist
                  </p>
                  <h3 className="text-2xl break-words">{artist.name}</h3>
                  <p className="mt-2 text-sm text-stone-600 break-words">
                    {artist.info}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    className={editButton}
                    onClick={() => handleEditArtist(artist)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={deleteButton}
                    onClick={() => handleDeleteArtist(artist.id)}
                  >
                    Delete
                  </button>
                </div>
              </header>

              {/* Collections */}
              <div className="space-y-6 p-5">
                {artistCollections.length === 0 && (
                  <p className="text-sm text-stone-500">
                    No collections for this artist yet.
                  </p>
                )}

                {artistCollections.map((collection) => {
                  const collectionArtworks = artworks.filter(
                    (artwork) => artwork.collection_id === collection.id,
                  );

                  return (
                    <section
                      key={collection.id}
                      className="rounded-xl border border-stone-200 p-4 sm:p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="mb-1 text-xs uppercase tracking-widest text-stone-500">
                            Collection
                          </p>
                          <h4 className="text-xl break-words">
                            {collection.title}
                          </h4>
                          <p className="mt-2 text-sm text-stone-600 break-words">
                            {collection.description}
                          </p>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            className={editButton}
                            onClick={() => handleEditCollection(collection)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={deleteButton}
                            onClick={() =>
                              handleDeleteCollection(collection.id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Artworks */}
                      {collectionArtworks.length === 0 ? (
                        <p className="mt-5 text-sm text-stone-500">
                          No artworks in this collection yet.
                        </p>
                      ) : (
                        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {collectionArtworks.map((artwork) => (
                            <li
                              key={artwork.id}
                              className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-stone-200"
                            >
                              {artwork.image_url && (
                                <img
                                  src={artwork.image_url}
                                  alt={artwork.title}
                                  loading="lazy"
                                  className="h-48 w-full bg-stone-50 object-contain"
                                />
                              )}

                              <div className="flex flex-1 flex-col p-4">
                                <h5 className="text-lg break-words">
                                  {artwork.title}
                                </h5>

                                {artwork.medium && (
                                  <p className="mt-1 text-sm text-stone-500">
                                    {artwork.medium}
                                  </p>
                                )}

                                <p className="mt-2 text-sm text-stone-600 break-words">
                                  {artwork.description}
                                </p>

                                <div className="mt-auto flex justify-end gap-2 pt-4">
                                  <button
                                    type="button"
                                    className={editButton}
                                    onClick={() => handleEditArtwork(artwork)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    className={deleteButton}
                                    onClick={() =>
                                      handleDeleteArtwork(artwork.id)
                                    }
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ManageData;
