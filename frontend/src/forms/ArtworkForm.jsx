import { useState } from "react";
import { Input } from "../components/tailgrids/core/input";
import { Label } from "../components/tailgrids/core/label";
import { Button } from "../components/tailgrids/core/button";


const ArtworkForm = ({
  addArtwork,
  collections,
  artworkToEdit,
  updateArtwork,
  onSaved,
}) => {
  const [collectionId, setCollectionId] = useState(artworkToEdit?.collection_id ?? "");

  const [title, setTitle] = useState(artworkToEdit?.title ?? "");
  const [image_url, setImage_url] = useState(artworkToEdit?.image_url ?? "");
  const [medium, setMedium] = useState(artworkToEdit?.medium ?? "");
  const [description, setDescription] = useState(artworkToEdit?.description ?? "");
  const [error, setError] = useState("");

  const [imageMethod, setImageMethod] = useState("url");
  const [imageFile, setImageFile] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      let finalImageUrl = image_url;

      if (imageMethod === "upload") {
        if (!imageFile) {
          throw new Error("Please select an image");
        }

        finalImageUrl = await uploadImage();
      }
      const artworkData = {
      title,
      image_url: finalImageUrl,
      medium,
      description,
      collection_id: Number(collectionId),
    };
      if (artworkToEdit) {
        await updateArtwork(artworkToEdit.id, artworkData);
      } else {
        await addArtwork(artworkData);
      }
      alert(
        artworkToEdit
          ? "Artwork updated successfully!"
          : "Artwork added successfully!",
      );
      setCollectionId("");
      setTitle("");
      setImage_url("");
      setImageFile(null);
      setMedium("");
      setDescription("");
      onSaved();
    } catch (error) {
      setError(error.message);
    }
  }

  async function uploadImage(){
    if (!imageFile) return null;
    
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch("/api/upload", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed")
    }
    const data = await response.json()
    return data.image_url;

  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        id="artworkForm"
        className="flex flex-col  sm:gap-2 md:gap-4 sm:m-0 md:m-20"
      >
        <h1 className="text-3xl m-auto">Artwork form</h1>

        <label htmlFor="collectionSelect">Choose a collection:</label>

        <select
          id="collectionSelect"
          name="collection_id"
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
          required
          className="w-full rounded-xl border border-stone-300 bg-white p-3 text-base text-stone-800"
        >
          <option value="">Select a collection</option>

          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.title}
            </option>
          ))}
        </select>

        <Label htmlFor="artworkTitle">Artwork Title:</Label>
        <Input
          required
          type="text"
          value={title ?? ""}
          id="artworkTitle"
          name="artworkTitle"
          onChange={(e) => setTitle(e.target.value)}
        />

        <Label htmlFor="artworkImage">Artwork Image:</Label>
        <select
          value={imageMethod ?? ""}
          onChange={(e) => setImageMethod(e.target.value)}
          className="w-full rounded-xl border border-stone-300 p-3"
        >
          <option value="url">Image URL</option>
          <option value="upload">Upload Image</option>
        </select>
        {imageMethod === "url" ? (
          <Input
            type="url"
            value={image_url ?? ""}
            placeholder="https://example.com/image.jpg"
            onChange={(e) => setImage_url(e.target.value)}
          />
        ) : (
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
          />
        )}

        <Label htmlFor="artworkMedium">Artwork Medium:</Label>
        <Input
          type="text"
          value={medium ?? ""}
          id="artworkMedium"
          name="artworkMedium"
          onChange={(e) => setMedium(e.target.value)}
        />

        <Label htmlFor="artworkDescription">Artwork Description:</Label>
        <textarea
          id="artworkDescription"
          value={description ?? ""}
          name="artworkDescription"
          onChange={(e) => setDescription(e.target.value)}
          className="border-gray-300 rounded-2xl focus:border-indigo-300 focus:ring-4 focus:ring-blue-300/30"
        />

        {error && <p className="text-red-600">{error}</p>}

        <Button
          type="submit"
          className="w-30 m-auto bg-green-200 hover:bg-green-300 p-3 rounded-3xl text-gray-600"
        >
          {artworkToEdit ? "Save Changes" : "Add Artwork"}
        </Button>

        {artworkToEdit && (
          <Button type="button" onClick={onSaved}>
            Cancel
          </Button>
        )}
      </form>
    </>
  );
};

export default ArtworkForm;
