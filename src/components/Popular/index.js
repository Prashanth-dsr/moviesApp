import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import LoaderView from '../LoaderView'
import FailureView from '../FailureView'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_progress',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Popular extends Component {
  state = {videosList: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getVideos()
  }

  getVideos = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/movies-app/popular-movies'
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
    const {videosList} = this.state
    return (
      <ul>
        {videosList.map(video => {
          const {id, title, posterPath} = video
          return (
            <li key={id}>
              <Link to={`/movies/${id}`}>
                <img src={posterPath} alt={title} />
              </Link>
            </li>
          )
        })}
      </ul>
    )
  }

  handleTryAgain = () => {
    this.getVideos()
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

export default Popular
