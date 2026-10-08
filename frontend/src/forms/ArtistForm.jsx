import React from 'react'
import { useState } from 'react'
import { Input } from "../components/tailgrids/core/Input";

const ArtistForm = () => {
    
  return (
    <>
        <section>
            <form id="artistForm" className='flex flex-col sm:gap-2 md:gap-4 sm:m-2 md:m-20'>
                <h1 className='text-3xl m-auto'>Artist form</h1>

                <label htmlFor="artistName">Artist Name:</label>
                <Input type="text" id="artistName" name="artistName" />

                <label htmlFor="artistInfo">Artist Info:</label>
                <Input type="text" id="artistInfo" name="artistInfo" />

                <button type="submit" className='w-30 m-auto bg-green-200 p-3 rounded-3xl text-gray-600'>Add Artist</button>

            </form>
        </section>
    </>
  )
}

export default ArtistForm