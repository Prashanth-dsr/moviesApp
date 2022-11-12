import {Link} from 'react-router-dom'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './index.css'

const ReactSlick = props => {
  const {videosList} = props
  const settings = {
    slidesToShow: 4,
    slidesToScroll: 1,
  }
  return (
    <div className="slider-container">
      <Slider {...settings}>
        {videosList.map(video => {
          const {id, title, posterPath} = video
          return (
            <Link to={`/movies/${id}`} key={id}>
              <img src={posterPath} alt={title} className="item" />
            </Link>
          )
        })}
      </Slider>
    </div>
  )
}

export default ReactSlick
