import React from 'react'
import { useState } from 'react'
import { Input } from "../components/tailgrids/core/Input";

const ArtworkForm = () => {

    const [collectionId, setCollectionId] = useState("");
    const [collections, setCollections] = useState([]);
    
  return (
    <>
        <form id="artworkForm" className='flex flex-col  sm:gap-2 md:gap-4 sm:m-0 md:m-20'>
            <h1 className='text-3xl m-auto'>Artwork form</h1>

            <label htmlFor="collectionSelect">Choose an collection:</label>
            <select required value={collectionId} onChange={(e) => setCollectionId(e.target.value)} 
            id="collectionSelect" name="collection_id" className="border-gray-300 rounded-xl">

                <option value="">Select a collection:</option>

                {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                    {collection.title}
                    </option>
                ))}          
            </select> 

            <label htmlFor="artworkTitle">Artwork Title:</label>
            <Input type="text" id="artworkTitle" name="artworkTitle" />

            <label htmlFor="artworkImage">Artwork Image:</label>
            <Input type="url" id="artworkImage" name="artworkImage" />

            <label htmlFor="artworkMedium">Artwork Medium:</label>
            <Input type="text" id="artworkMedium" name="artworkMedium" />

            <label htmlFor="artworkDescription">Artwork Description:</label>
            <textarea id="artworkDescription" name="artworkDescription" className='border-gray-300 rounded-2xl focus:border-indigo-300 focus:ring-4 focus:ring-blue-300/30' />

            <button type="submit" className='w-30 m-auto bg-green-200 p-3 rounded-3xl text-gray-600'>Add Artist</button>
        </form>
    </>
  )
}

export default ArtworkForm