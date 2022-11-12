import {Component} from 'react'
import Cookies from 'js-cookie'
import format from 'date-fns/format'
import Header from '../Header'
import Footer from '../Footer'
import LoaderView from '../LoaderView'
import FailureView from '../FailureView'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_progress',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class MovieItemDetails extends Component {
  state = {movieDetails: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getVideoDetails()
  }

  getVideoDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/movies-app/movies/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const movieDetails = data.movie_details

      const formattedMovieDetails = {
        adult: movieDetails.adult,
        backdropPath: movieDetails.backdrop_path,
        budget: movieDetails.budget,
        genres: movieDetails.genres,
        id: movieDetails.id,
        overview: movieDetails.overview,
        posterPath: movieDetails.poster_path,
        releaseDate: movieDetails.release_date,
        runtime: movieDetails.runtime,
        similarMovies: movieDetails.similar_movies,
        spokenLanguages: movieDetails.spoken_languages,
        title: movieDetails.title,
        voteAverage: movieDetails.vote_average,
        voteCount: movieDetails.vote_count,
      }

      formattedMovieDetails.similarMovies = formattedMovieDetails.similarMovies.map(
        movie => ({
          backdropPath: movie.backdrop_path,
          id: movie.id,
          overview: movie.overview,
          posterPath: movie.poster_path,
          title: movie.title,
        }),
      )

      formattedMovieDetails.spokenLanguages = formattedMovieDetails.spokenLanguages.map(
        language => ({id: language.id, englishName: language.english_name}),
      )

      this.setState({
        apiStatus: apiStatusConstants.success,
        movieDetails: formattedMovieDetails,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderBanner = () => {
    const {movieDetails} = this.state
    const {
      backdropPath,
      title,
      runtime,
      adult,
      releaseDate,
      overview,
    } = movieDetails
    return (
      <div
        className="banner-wrapper"
        style={{backgroundImage: `url(${backdropPath})`}}
      >
        <div className="banner">
          <h1>{title}</h1>
          <div>
            <p>{`${Math.floor(runtime / 60)}h ${runtime % 60}m`}</p>
            <p>{adult ? 'R' : 'U/A'}</p>
            <p>{new Date(releaseDate).getFullYear()}</p>
          </div>
          <p>{overview}</p>
          <button type="button">Play</button>
        </div>
      </div>
    )
  }

  renderInfo = () => {
    const {movieDetails} = this.state
    const {
      genres,
      spokenLanguages,
      voteCount,
      voteAverage,
      budget,
      releaseDate,
    } = movieDetails
    return (
      <div>
        <div>
          <h1>Genres</h1>
          {genres.map(genre => (
            <p key={genre.id}>{genre.name}</p>
          ))}
        </div>
        <div>
          <h1>Audio Available</h1>
          {spokenLanguages.map(language => (
            <p key={language.id}>{language.englishName}</p>
          ))}
        </div>
        <div>
          <h1>Rating Count</h1>
          <p>{voteCount}</p>
          <h1>Rating Average</h1>
          <p>{voteAverage}</p>
        </div>
        <div>
          <h1>Budget</h1>
          <p>{budget}</p>
          <h1>Release Date</h1>
          <p>{format(new Date(releaseDate), 'do MMMM yyyy')}</p>
        </div>
      </div>
    )
  }

  renderSimilarItems = () => {
    const {movieDetails} = this.state
    const {similarMovies} = movieDetails
    return (
      <div>
        <h1>More like this</h1>
        <ul className="similar-items">
          {similarMovies.map(movie => {
            const {id, title, posterPath} = movie
            return (
              <li key={id}>
                <img src={posterPath} alt={title} className="item" />
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  renderContent = () => (
    <div>
      {this.renderBanner()}
      {this.renderInfo()}
      {this.renderSimilarItems()}
    </div>
  )

  handleTryAgain = () => {
    this.getVideoDetails()
  }

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'IN_PROGRESS':
        return <LoaderView />
      case 'FAILURE':
        return <FailureView handleTryAgain={this.handleTryAgain} />
      case 'SUCCESS':
        return this.renderContent()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderView()}
        <Footer />
      </div>
    )
  }
}

export default MovieItemDetails
