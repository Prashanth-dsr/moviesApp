import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import LoaderView from '../LoaderView'
import FailureView from '../FailureView'
import ReactSlick from '../ReactSlick'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_progress',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    trendingList: [],
    originalsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getVideosList()
  }

  handleTryAgain = () => {
    this.getVideosList()
  }

  formatData = data => {
    const {results} = data
    const formattedResults = results.map(result => ({
      backdropPath: result.backdrop_path,
      id: result.id,
      overview: result.overview,
      posterPath: result.poster_path,
      title: result.title,
    }))
    return formattedResults
  }

  getVideosList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const trendingUrl = 'https://apis.ccbp.in/movies-app/trending-movies'
    const originalsUrl = 'https://apis.ccbp.in/movies-app/originals'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const trendingResponse = await fetch(trendingUrl, options)
    const originalsResponse = await fetch(originalsUrl, options)
    const trendingData = await trendingResponse.json()
    const originalsData = await originalsResponse.json()

    if (trendingResponse.ok) {
      const trendingResults = this.formatData(trendingData)
      this.setState({
        trendingList: trendingResults,
      })
    }

    if (originalsResponse.ok) {
      const originalsResults = this.formatData(originalsData)
      this.setState({
        originalsList: originalsResults,
      })
    }

    if (trendingResponse.ok && originalsResponse.ok) {
      this.setState({apiStatus: apiStatusConstants.success})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderBannerContent = () => {
    const {originalsList} = this.state
    const videoObj = originalsList[Math.floor(Math.random() * 10)]
    const {title, overview, backdropPath} = videoObj
    return (
      <div style={{backgroundImage: `url(${backdropPath})`}} className="banner">
        <div className="banner-transparent">
          <h1>{title}</h1>
          <p>{overview}</p>
          <button type="button">Play</button>
        </div>
      </div>
    )
  }

  renderSlick = () => {
    const {trendingList, originalsList} = this.state
    return (
      <div>
        <h1 className="slick-heading">Trending Now</h1>
        <ReactSlick videosList={trendingList} />
        <h1 className="slick-heading">Originals</h1>
        <ReactSlick videosList={originalsList} />
      </div>
    )
  }

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'IN_PROGRESS':
        return <LoaderView />
      case 'FAILURE':
        return <FailureView handleTryAgain={this.handleTryAgain} />
      case 'SUCCESS':
        return (
          <div>
            {this.renderBannerContent()}
            {this.renderSlick()}
          </div>
        )
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-card">
        <Header />
        {this.renderView()}
        <Footer />
      </div>
    )
  }
}

export default Home
