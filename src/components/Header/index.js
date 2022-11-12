import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {HiOutlineSearch} from 'react-icons/hi'

import './index.css'

class Header extends Component {
  state = {searchInput: ''}

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  handleSearch = () => {
    const {searchInput} = this.state
    const {getVideos} = this.props
    getVideos(searchInput)
  }

  renderSearch = () => {
    const {searchInput} = this.state
    const {match} = this.props
    const {path} = match
    if (path === '/search') {
      return (
        <div>
          <input
            type="search"
            onChange={this.changeSearchInput}
            value={searchInput}
          />
          <button type="button" onClick={this.handleSearch}>
            <HiOutlineSearch />
          </button>
        </div>
      )
    }
    return (
      <Link to="/search" className="tab-color">
        <HiOutlineSearch />
      </Link>
    )
  }

  render() {
    const {match} = this.props
    const {path} = match
    const homeTabColor = path === '/' ? 'tab-color' : 'no-highlight'
    const popularTabColor = path === '/popular' ? 'tab-color' : 'no-highlight'
    return (
      <div className="header-card">
        <div className="header-box">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dfnwpgiwt/image/upload/v1667975533/Group_7399_aiiajj.png"
              alt="website logo"
              className="img"
            />
          </Link>
          <ul className="home-popular-tabs-card">
            <Link to="/" className={`tab ${homeTabColor}`}>
              <li>Home</li>
            </Link>
            <Link to="/popular" className={`tab ${popularTabColor}`}>
              <li>Popular</li>
            </Link>
          </ul>
        </div>
        <div className="header-box right-card">
          {this.renderSearch()}
          <Link to="/account">
            <img
              src="https://res.cloudinary.com/dfnwpgiwt/image/upload/v1667976701/Avatar_e34xbr.png"
              alt="profile"
              className="img"
            />
          </Link>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
