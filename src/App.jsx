import { useState, useEffect } from 'react'
import './index.css'
import Search from './components/search'
const API_BASE_URL ='https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS ={
  method : 'GET',
  Headers :{
    accept : 'application/json',
    Authorization :`Bearer ${API_KEY}`
  }
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessege, setErrorMessege]=useState("");

  const fetchMovies = async()=>{
    try{
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if(!response.ok){
        throw new Error('Failed to Fetch Movies'); 
      }
      const data = await response.json();
      console.log(data);
    }
    catch(error){
      console.log(`Error Detected ${error}`);
      setErrorMessege("The Movie is Currently Not Available")
    }
  }

  useEffect(()=>{
      fetchMovies();
  },[])

  return (
    <main>
      <div className='pattern'/>
      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        <section className='all-movies'>
            <h2>All Movies</h2>
            {errorMessege && <p className='text-red-500'>{errorMessege}</p>}
        </section>
        
      </div>
    </main>
  )
}

export default App
