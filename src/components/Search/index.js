import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
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

class Search extends Component {
  state = {
    videosList: [],
    apiStatus: apiStatusConstants.initial,
    searchInput: '',
  }

  getVideos = async searchInput => {
    this.setState({apiStatus: apiStatusConstants.inProgress, searchInput})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/movies-app/movies-search?search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const {results} = data
      const formattedResults = results.map(result => ({
        backdropPath: result.backdrop_path,
        id: result.id,
        overview: result.overview,
        posterPath: result.poster_path,
        title: result.title,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        videosList: formattedResults,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderContent = () => {
    const {videosList, searchInput} = this.state
    if (videosList.length > 0) {
      return (
        <ul>
          {videosList.map(video => {
            const {id, title, posterPath} = video
            return (
              <li key={id}>
                <Link to={`/movies/${id}`}>
                  <img src={posterPath} alt={title} className="item" />
                </Link>
              </li>
            )
          })}
        </ul>
      )
    }
    return (
      <div>
        <img
          src="https://res.cloudinary.com/dfnwpgiwt/image/upload/v1668145935/Group_7394_rj2rkf.png"
          alt="no movies"
        />
        <p>Your search for {searchInput} did not find any matches.</p>
      </div>
    )
  }

  handleTryAgain = () => {
    const {searchInput} = this.state
    this.getVideos(searchInput)
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
        <Header getVideos={this.getVideos} />
        {this.renderView()}
        <Footer />
      </div>
    )
  }
}

export default Search
