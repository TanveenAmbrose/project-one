import { useState, useEffect } from 'react'
import { useDebounce } from 'react-use';
import './index.css'
import Search from './components/search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { getTrendingMovies, updateSearchCount } from './appwrite';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MovieDetails from './components/MovieDetails';
import Home from './components/Home';

function App() {
  return (
    <BrowserRouter basename="/project-one">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
