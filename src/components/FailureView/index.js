import {withRouter} from 'react-router-dom'

const FailureView = props => {
  const {match, handleTryAgain} = props
  const {path} = match
  const imgUrl =
    path === '/'
      ? 'https://res.cloudinary.com/dfnwpgiwt/image/upload/v1667981498/alert-triangle_kqzqxn.png'
      : 'https://res.cloudinary.com/dfnwpgiwt/image/upload/v1667981610/Background-Complete_rtynpj.png'
  const onTryAgain = () => {
    handleTryAgain()
  }
  return (
    <div>
      <img src={imgUrl} alt="failure view" />
      <p>Something went wrong. Please try again</p>
      <button type="button" onClick={onTryAgain}>
        Try Again
      </button>
    </div>
  )
}

export default withRouter(FailureView)
