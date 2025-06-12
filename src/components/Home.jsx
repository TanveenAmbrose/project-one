import React, { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import Search from './search';
import Spinner from './Spinner';
import MovieCard from './MovieCard';
import { getTrendingMovies, updateSearchCount } from '../appwrite';

const API_BASE_URL ='https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
const SEARCH_API_URL = 'https://api.themoviedb.org/3/search/movie';
const API_OPTIONS ={
  method : 'GET',
  headers :{
    accept : 'application/json',
    Authorization :`Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjBmMmI3MDRjYjQ0NjU4ZDM4YWZmOTM5MWY3NTQ3MSIsIm5iZiI6MTc0OTQ1MDA4MS43MjUsInN1YiI6IjY4NDY3ZDYxN2VlNWU5MDAwOGZkNWYxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.i16N6m1NowgbsjbPJ4ti2Fkr_oON4GKS-dCXRiO3HEw`
  }
}

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies,setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedSearchTerm,setDebouncedTerm] = useState("");

  useDebounce(()=>setDebouncedTerm(searchTerm),500,[searchTerm])

  const fetchMovies = async(query='')=>{
      setIsLoading(true);
      setErrorMessage('');

    try{
      const endpoint = query ? `${SEARCH_API_URL}?query=${encodeURIComponent(query)}` : API_BASE_URL;
      const response = await fetch(endpoint, API_OPTIONS);
      if(!response.ok){
        throw new Error('Failed to Fetch Movies'); 
      }
      const data = await response.json();
      if(data.success === false){
        setErrorMessage(data.status_message || 'Failed To Fetch Movies');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);

      if(query && data.results.length > 0){
        await  updateSearchCount(query,data.results[0]);
      }
    }
    catch(error){
      setErrorMessage("The Movie is Currently Not Available")
    }
    finally{
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async ()=>{
    try{
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    }
    catch(error){
      console.log(`Error fetching movies : ${error}`);
    }
  }

  useEffect(()=>{
      fetchMovies(debouncedSearchTerm);
  },[debouncedSearchTerm])

  useEffect(()=>{
    loadTrendingMovies();
  },[])

  return (
    <main>
      <div className='pattern'/>
      <div className='wrapper'>
        <header>
          <img src="/project-one/logo.png" className='w-32' alt="Logo" />
          <img src="/project-one/hero.png" alt="Hero Banner" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index)=>(
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>)}

        <section className='all-movies'>
            <h2>All Movies</h2>
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

export default Home;
