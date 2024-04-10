import {Component} from 'react'
import NavBar from '../NavBar'
import Cookies from 'js-cookie'
import MovieCard from '../MovieCard'

class MovieItemDetails extends Component {
  state = {movieData: [], castData: []}
  componentDidMount() {
    this.getMovieDetailsData()
  }

  getMovieData = data => ({
    id: data.id,
    backdropPath: data.backdrop_path,
    overview: data.overview,
    posterPath: data.poster_path,
    title: data.title,
    releaseDate: data.release_date,
    voteAverage: data.vote_average,
  })

  getCastData = data => ({
    id: data.id,
    posterPath: data.poster_path,
    title: data.title,
    character: data.character,
  })

  getMovieDetailsData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const Api_key = 'f32b79895b21468afbdd6d5342cbf3da'
    const movieDetailApiUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${Api_key}&language=en-US`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(movieDetailApiUrl, options)
    const fetchedData = await response.json()
    console.log(fetchedData)
    if (response.ok) {
      const updatedMovieData = this.getMovieData(fetchedData.movie_details)
      const updatedcastData = fetchedData.movie_details.genres.map(eachData =>
        this.getCastData(eachData),
      )
      this.setstate({
        movieData: updatedMovieData,
        castData: updatedcastData,
      })
    }
  }

  releasedYear = () => {
    const {movieData} = this.state
    const {releaseDate} = movieData
    if (releaseDate !== undefined) {
      return format(new Date(releaseDate), 'yyyy')
    }
    return null
  }

  movieDetails = () => {
    const {movieDetailData, castData} = this.state

    return (
      <div className="movie-detail-bg-container">
        <div
          style={{backgroundImage: `url(${movieDetailData.backdropPath})`}}
          className="bg-image"
        >
          <Header />
          <div className="movie-heading-container">
            <h1 className="poster-title">{movieDetailData.title}</h1>
            <div className="time-year-container">
              <p className="year-time">{this.releasedYear()}</p>
            </div>
            <p className="poster-description">{movieDetailData.overview}</p>
          </div>
        </div>
        <hr />
        <div className="movie-detail-flex-container">
          <div className="movie-content-details">
            <h1 className="movie-content-title">Cast</h1>
            <ul className="more-movies-container">
              {castData.map(eachData => (
                <MovieCard movieData={eachData} key={eachData.id} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <>
        <NavBar />
        {this.movieDetails()}
      </>
    )
  }
}

export default MovieItemDetails
