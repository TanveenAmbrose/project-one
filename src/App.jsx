import { useState, useEffect } from 'react'
import './index.css'
import Search from './components/search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';

const API_BASE_URL ='https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
const API_KEY = 'eb0f2b704cb44658d38aff9391f75471';
const API_OPTIONS ={
  method : 'GET',
  headers :{
    accept : 'application/json',
    Authorization :`Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjBmMmI3MDRjYjQ0NjU4ZDM4YWZmOTM5MWY3NTQ3MSIsIm5iZiI6MTc0OTQ1MDA4MS43MjUsInN1YiI6IjY4NDY3ZDYxN2VlNWU5MDAwOGZkNWYxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.i16N6m1NowgbsjbPJ4ti2Fkr_oON4GKS-dCXRiO3HEw`
  }
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMovies = async(query='')=>{
      setIsLoading(true);
      setErrorMessage('');

    try{
      const endpoint = API_BASE_URL;
      const response = await fetch(endpoint, API_OPTIONS);
      if(!response.ok){
        throw new Error('Failed to Fetch Movies'); 
      }
      const data = await response.json();
      console.log(data);
      if(data.success === false){
        setErrorMessage(data.status_message || 'Failed To Fetch Movies');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || [])
    }


    catch(error){
      console.error(`Error Detected ${error}`);
      setErrorMessage("The Movie is Currently Not Available")
    }
    finally{
      setIsLoading(false);
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
          <img src="./logo.png" className='w-32' alt="Logo" />
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        <section className='all-movies'>
            <h2 className="mt-[40px]">All Movies</h2>
            {isLoading ?
            (<Spinner/>) : errorMessage ? (<p className='text-red-500'>{errorMessage}
            </p>) : (<ul>
              {movieList.map((movie)=>(
                <MovieCard key={movie.id} movie={movie}/>
                ))}
            </ul>)
            }
        </section>
        
      </div>
    </main>
  )
}

export default App
