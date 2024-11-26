import React, { useState, useEffect, useRef } from "react";
import "./MovieSearch.css";

const MovieSearch = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const hasRunRef = useRef(false);
  const apiKey = "41a57319f006c83636274ea158125ee9";
  let base_url = "https://api.themoviedb.org/3/";

  // Fetch movies whenever the query or page changes
  const updateMovieList = async (route_url) => {
    try {
      const response = await fetch(base_url + route_url);
      const data = await response.json();
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error("Error fetching movie data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    let route_url = "";
    if (!query) {
      route_url = `movie/now_playing?api_key=${apiKey}&page=${page}`;
    } else {
      route_url = `search/movie?api_key=${apiKey}&query=${query}&page=${page}`;
    }
    setPage(page);
    updateMovieList(route_url);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    let route_url = "";
    if(!query){
        route_url = `movie/now_playing?api_key=${apiKey}`;
    }else{
        route_url = `search/movie?api_key=${apiKey}&query=${query}&page=1`;
    }
    setQuery(query);
    updateMovieList(route_url);
    setPage(1); // Reset to page 1 for a new search
  };

  useEffect(() => {
    if (!hasRunRef.current) {
      const route_url = `movie/now_playing?api_key=${apiKey}`;
      updateMovieList(route_url);
      hasRunRef.current = true;
    }
  }, []); // Watch for changes in both query and page

  return (
    <div className="movie-search-container">
      <input
        type="text"
        placeholder="Search for a movie..."
        value={query}
        onChange={handleSearch}
      />
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="movie-list">
          {movies.length > 0 &&
            movies.map((movie) => (
              <div key={movie.id} className="movie-item">
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                />
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.overview}</p>
                </div>
              </div>
            ))}
        </div>
      )}
      <div className="pagination">
        {page > 1 && (
          <button onClick={() => handlePageChange(page - 1)}>Previous</button>
        )}
        <span>
          Page {page} of {totalPages}
        </span>
        {page < totalPages && (
          <button onClick={() => handlePageChange(page + 1)}>Next</button>
        )}
      </div>
    </div>
  );
};

export default MovieSearch;
