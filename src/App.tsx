import { useState } from "react";
import MovieList from "./components/MovieList";
import SearchBar from "./components/SearchBar";
import { SAMPLE_MOVIES } from "./data/sampleMovies";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  //const [count, setCount] = useState(0);

  const filteredMovies = SAMPLE_MOVIES.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="app-layout">
      <main className="main-container">
        <h1>Movie APP</h1>

        <SearchBar searchQuery={searchQuery} onChange={setSearchQuery} />
        <MovieList movies={filteredMovies} />

      </main>
    </div>
  );
}

export default App;
