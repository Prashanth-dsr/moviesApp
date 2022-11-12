import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-card">
    <h1>Lost Your Way?</h1>
    <p>
      We are sorry, the page you requested could not be found Please go back to
      the homepage.
    </p>
    <Link to="/login">
      <button type="button">Go to Home</button>
    </Link>
  </div>
)

export default NotFound
