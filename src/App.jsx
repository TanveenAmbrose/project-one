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
  const [errorMessege, setErrorMessege] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoding] = useState(false);

  const fetchMovies = async()=>{
      setIsLoding(true);
      setErrorMessege('');

    try{
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if(!response.ok){
        throw new Error('Failed to Fetch Movies'); 
      }
      const data = await response.json();
      if(data.response === 'False' ){
        setErrorMessege(data.Error || 'Failed To Fetch Movies');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || [])
    }
    catch(error){
      console.log(`Error Detected ${error}`);
      setErrorMessege("The Movie is Currently Not Available")
    }
    finally{
      setIsLoding(false);
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
            {isLoading ?
            (<p className='text-white'>Loading....</p>) : errorMessege ? (<p className='text-red-500'>{errorMessege}
            </p>) : <ul>
              {movieList.map((movie)=>(
                <p key={movie.id} className='text-white'>{movie.title}</p>
                ))}
            </ul>
            }
        </section>
        
      </div>
    </main>
  )
}

export default App
