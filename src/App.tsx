import MovieList from "./components/MovieList"
import SearchBar from "./components/SearchBar"

function App() {

  return (
    <div className="app-layout">
      <main className="main-container">
        <h1>Movie APP</h1>
        <SearchBar />
        <MovieList />
        

      </main>
    </div>
  )
}

export default App
