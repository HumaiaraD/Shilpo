import React from 'react'
import {useState} from 'react'
import ArtistForm from '../forms/ArtistForm'
import CollectionForm from '../forms/CollectionForm'
import ArtworkForm from '../forms/ArtworkForm'

const Admin = () => {

  const [activeForm, setActiveForm] = useState("artist");

  return (
    <>
      <header className='flex flex-col gap-2 text-center'>
        <h1 className='text-4xl'>Welcome to admin page. </h1>
        <p>Add Artists, collections, or artworks using forms below.</p>
      </header>
      <main className='flex flex-col gap-3 m-20'>
          <nav className='flex gap-8 justify-center'>
            <button onClick={() => setActiveForm("artist")}>Add Artist</button>
            <button onClick={() => setActiveForm("collection")}>Add Collection</button>
            <button onClick={() => setActiveForm("artwork")}>Add Artwork</button>
          </nav>

          <section className=''>
            {activeForm === "artist" && <ArtistForm />}
            {activeForm === "collection" && <CollectionForm />}
            {activeForm === "artwork" && <ArtworkForm />}
          </section>
      </main>
    </>
  )
}

export default Admin

