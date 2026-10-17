import React from 'react'
import {useState} from 'react'
import ArtistForm from '../forms/ArtistForm'
import CollectionForm from '../forms/CollectionForm'
import ArtworkForm from '../forms/ArtworkForm'
import useFetch from '../components/useFetch'
import ManageData from '../components/ManageData'

const Admin = ({user}) => {

  const [activeForm, setActiveForm] = useState("artist");


  const {items: artists, addItem: addArtist, deleteItem: deleteArtist, updateItem: updateArtist,} 
        = useFetch("https://shilpo-api.onrender.com/artists");
  const {items: collections, addItem: addCollection, deleteItem: deleteCollection, updateItem: updateCollection, } 
        = useFetch("https://shilpo-api.onrender.com/collections");
  const {items: artworks, addItem: addArtwork, deleteItem: deleteArtwork, updateItem: updateArtwork,} 
        = useFetch("https://shilpo-api.onrender.com/artworks");

  const [artistToEdit, setArtistToEdit] = useState(null);
  const [collectionToEdit, setCollectionToEdit] = useState(null);
  const [artworkToEdit, setArtworkToEdit] = useState(null);

  const myArtists = artists.filter(
    (artist) => artist.user_id === user.id
  );

  const myCollections = collections.filter((collection) =>
    myArtists.some((artist) => artist.id === collection.artist_id)
  );

  const myArtworks = artworks.filter((artwork) =>
    myCollections.some(
      (collection) => collection.id === artwork.collection_id
    )
  );

  function scrollToForm() {
  document.getElementById("portfolio-form")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

  function handleEditArtist(artist) {
    setArtistToEdit(artist);
    setActiveForm("artist");
    scrollToForm();
  }

  async function handleDeleteArtist(id) {
    if (!window.confirm("Delete this artist and their collections and artworks?")) {
      return;
    }

    try {
      await deleteArtist(id);
      if (artistToEdit?.id === id) setArtistToEdit(null);
    } catch (err) {
      alert(err.message);
    }
  }

  function handleEditCollection(collection){
    setCollectionToEdit(collection);
    setActiveForm("collection");
    scrollToForm();
  }
  async function handleDeleteCollection(id) {
    if (!window.confirm("Delete this collection and its artworks?")) {
      return;
    }

    try {
      await deleteCollection(id);
      if (collectionToEdit?.id === id) setCollectionToEdit(null);
    } catch (err) {
      alert(err.message);
    }
  }

  function handleEditArtwork(artwork){
    setArtworkToEdit(artwork);
    setActiveForm("artwork");
    scrollToForm();
  }

  async function handleDeleteArtwork(id) {
    if (!window.confirm("Delete this artwork?")) {
      return;
    }

    try {
      await deleteArtwork(id);
      if (artworkToEdit?.id === id) setArtworkToEdit(null);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <>
      <header className='flex flex-col gap-2 text-center'>
        <h1 className='text-4xl'>Publish your art </h1>
        <p>Add Artists, collections, or artworks using forms below.</p>
      </header>
      <main className='flex flex-col gap-3 m-20'>
          <nav className='flex gap-8 justify-center'>
            <button onClick={() => {setArtistToEdit(null); setActiveForm("artist")}} className=' focus:text-xl'>Add Artist</button>
            <button onClick={() => {setCollectionToEdit(null); setActiveForm("collection")}}className=' focus:text-xl'>Add Collection</button>
            <button onClick={() => {setArtworkToEdit(null); setActiveForm("artwork")}} className=' focus:text-xl'>Add Artwork</button>
          </nav>

          <section className='' id='portfolio-form'>
            {activeForm === "artist" && 
            <ArtistForm addArtist={addArtist} artistToEdit={artistToEdit} updateArtist={updateArtist} 
                onSaved={() => setArtistToEdit(null)}/>}
            {activeForm === "collection" && 
            <CollectionForm artists={myArtists} addCollection={addCollection} collectionToEdit={collectionToEdit} updateCollection={updateCollection}
                onSaved={() => setCollectionToEdit(null)} />}
            {activeForm === "artwork" && 
            <ArtworkForm collections={myCollections}  addArtwork={addArtwork} artworkToEdit={artworkToEdit} updateArtwork={updateArtwork} 
                onSaved={() => setArtworkToEdit(null)} />}
          </section>
      </main>

      <ManageData
        artists={myArtists}
        collections={myCollections}
        artworks={myArtworks}
        handleEditArtist={handleEditArtist}
        handleDeleteArtist={handleDeleteArtist}
        handleEditCollection={handleEditCollection}
        handleDeleteCollection={handleDeleteCollection}
        handleEditArtwork={handleEditArtwork}
        handleDeleteArtwork={handleDeleteArtwork}
      />
    </>
  )
}

export default Admin

