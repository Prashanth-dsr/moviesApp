import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMsg: ''}

  changeUsername = event => {
    this.setState({username: event.target.value})
  }

  changePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {username, password, showSubmitError, errorMsg} = this.state
    return (
      <div>
        <img
          src="https://res.cloudinary.com/dfnwpgiwt/image/upload/v1667975533/Group_7399_aiiajj.png"
          alt="login website logo"
        />
        <form onSubmit={this.submitForm}>
          <h1>Login</h1>
          <label htmlFor="username">USERNAME</label>
          <br />
          <input
            type="username"
            id="username"
            value={username}
            onChange={this.changeUsername}
          />
          <br />
          <label htmlFor="password">PASSWORD</label>
          <br />
          <input
            type="password"
            id="password"
            value={password}
            onChange={this.changePassword}
          />
          <br />
          {showSubmitError && <p>{errorMsg}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }
}

export default Login
