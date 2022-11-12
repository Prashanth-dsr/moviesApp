import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'

const Account = props => {
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const renderContent = () => (
    <div>
      <div>
        <h1>Account</h1>
        <br />
        <div>
          <p>Member ship</p>
          <div>
            <p>username</p>
            <p>password</p>
          </div>
        </div>
        <div>
          <p>Plan details</p>
          <p>Premium </p>
          <p>Ultra HD</p>
        </div>
      </div>
      <button type="button" onClick={onLogout}>
        Logout
      </button>
    </div>
  )

  return (
    <div>
      <Header />
      {renderContent()}
      <Footer />
    </div>
  )
}

export default Account
