import React, { useState } from 'react'
import { Input } from './tailgrids/core/Input'
import { Label } from './tailgrids/core/Label'


const Search = ({search, setSearch}) => {

  return (
    <div className="p-5 ">
      <Label htmlFor="search">Search: </Label>
      <Input className='w-60'
        type="text"
        id="search"
        placeholder="Type a name to search..." value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  )
}

export default Search