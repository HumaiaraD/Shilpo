import { useState } from "react";
import { Input } from "../components/tailgrids/core/input";
import { Label } from "../components/tailgrids/core/label";
import { Button } from "../components/tailgrids/core/button";

const ArtistForm = ({ artistToEdit, addArtist, updateArtist, onSaved }) => {
  const [name, setName] = useState(artistToEdit?.name ?? "");
  const [info, setInfo] = useState(artistToEdit?.info ?? "");
  const [error, setError] = useState("");


  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const artistData = { name, info };

    try {
      if (artistToEdit) {
        await updateArtist(artistToEdit.id, artistData);
      } else {
        await addArtist(artistData);
      }
      alert(
        artistToEdit
          ? "Artist updated successfully!"
          : "Artist added successfully!",
      );

      setName("");
      setInfo("");
      onSaved();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <section>
        <form
          onSubmit={handleSubmit}
          id="artistForm"
          className="flex flex-col sm:gap-2 md:gap-4 sm:m-2 md:m-20"
        >
          <h1 className="text-3xl m-auto">Artist form</h1>

          <Label htmlFor="artistName">Artist Name:</Label>
          <Input
            type="text"
            value={name}
            id="artistName"
            name="artistName"
            onChange={(e) => setName(e.target.value)}
          />

          <Label htmlFor="artistInfo">Artist Info:</Label>
          <Input
            type="text"
            value={info}
            id="artistInfo"
            name="artistInfo"
            onChange={(e) => setInfo(e.target.value)}
          />

          {error && <p>{error}</p>}

          <Button
            type="submit"
            className="bg-neutral-900 px-8 py-4 text-sm w-1/3 mx-auto text-white transition hover:bg-neutral-700 disabled:opacity-50">
            {artistToEdit ? "Save Changes" : "Add Artist"}
          </Button>

          {artistToEdit && (
            <Button type="button" onClick={onSaved}>
              Cancel
            </Button>
          )}
        </form>
      </section>
    </>
  );
};

export default ArtistForm;
