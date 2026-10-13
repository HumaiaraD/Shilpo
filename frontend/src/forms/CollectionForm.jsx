import React from 'react'
import { useState } from 'react'
import { Input } from "../components/tailgrids/core/Input";


const CollectionForm = () => {

    const [artist, setArtist] = useState([]);
    const [artistId, setArtistId] = useState('');

  return (
    <>
         <form id="collectionForm" className='flex flex-col  sm:gap-2 md:gap-4 sm:m-2 md:m-20'>
            <h1 className='text-3xl m-auto'>Collection form</h1>
                   
          <label htmlFor="artistSelect">Choose an artist:</label>
          <select value={artistId} onChange={(e) => setArtistId(e.target.value)} className='border-gray-300 rounded-xl'
           id="artistSelect" name="artist_id"> 
                 
            <option value="">Select an artist</option>

              {artist.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}            
          </select> 

          <label htmlFor="collectionTitle">Collection Title:</label>
          <Input type="text" id="collectionTitle" name="collectionTitle" />

          <label htmlFor="collectionDescription">Collection Description:</label>
          <textarea id="collectionDescription" name="collectionDescription" className='border-gray-300 rounded-xl focus:border-indigo-300 focus:ring-4 focus:ring-blue-300/30'/>

          <label htmlFor="collectionImage">Collection Image:</label>
          <Input type="url" id="collectionImage" name="collectionImage" />

            <button type="submit" className='w-30 m-auto bg-green-200 p-3 rounded-3xl text-gray-600'>Add Artist</button>

        </form>
    </>
  )

export default CollectionForm