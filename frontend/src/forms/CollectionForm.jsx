import { useState } from "react";
import { Input } from "../components/tailgrids/core/input";
import { Button } from "../components/tailgrids/core/button";
import { Label } from "../components/tailgrids/core/label";

const CollectionForm = ({
  addCollection,
  artists,
  collectionToEdit,
  updateCollection,
  onSaved,
}) => {
  const [artistId, setArtistId] = useState(collectionToEdit?.artist_id ?? "");

  const [title, setTitle] = useState(collectionToEdit?.title ?? "");
  const [description, setDescription] = useState(collectionToEdit?.description ?? "");
  const [error, setError] = useState("");

  
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const collectionData = { title, description, artist_id: Number(artistId) };

    try {
      if (collectionToEdit) {
        await updateCollection(collectionToEdit.id, collectionData);
      } else {
        await addCollection(collectionData);
      }
      alert(
        collectionToEdit
          ? "Collection updated successfully!"
          : "Collection added successfully!",
      );
      setTitle("");
      setDescription("");
      setArtistId("");
      onSaved();
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <>
      <form
        onSubmit={handleSubmit}
        id="collectionForm"
        className="flex flex-col  sm:gap-2 md:gap-4 sm:m-2 md:m-20"
      >
        <h1 className="text-3xl m-auto">Collection form</h1>

        <label htmlFor="artistSelect">Choose an artist:</label>

        <select
          id="artistSelect"
          name="artist_id"
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
          required
          className="w-full rounded-xl border border-stone-300 bg-white p-3 text-base text-stone-800"
        >
          <option value="">Select an artist</option>

          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>

        <Label htmlFor="collectionTitle">Collection Title:</Label>
        <Input
          required
          type="text"
          id="collectionTitle"
          name="collectionTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Label htmlFor="collectionDescription">Collection Description:</Label>
        <textarea
          id="collectionDescription"
          name="collectionDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-gray-300 rounded-xl focus:border-indigo-300 focus:ring-4 focus:ring-blue-300/30"
        />

        {error && <p className="text-red-600">{error}</p>}

        <Button
          type="submit"
          className="bg-neutral-900 px-8 py-4 text-sm w-1/3 mx-auto text-white transition hover:bg-neutral-700 disabled:opacity-50"
        >
          {collectionToEdit ? "Save Changes" : "Add Collection"}
        </Button>

        {collectionToEdit && (
          <Button type="button" onClick={onSaved}>
            Cancel
          </Button>
        )}
      </form>
    </>
  );
};
export default CollectionForm;
