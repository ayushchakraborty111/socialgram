import React from 'react'
import Posts from './Posts'
import SearchComponent from './SearchComponent'

const Feed = () => {
  return (
    <div className='flex-1 my-8 flex flex-col items-center transition-all duration-300 ml-16 md:ml-60'>
      <SearchComponent />
      <Posts />
    </div>
  )
}

export default Feed