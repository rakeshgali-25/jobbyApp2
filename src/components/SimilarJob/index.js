import './index.css'
import {BsFillStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {HiLocationMarker} from 'react-icons/hi'

const SimilarJob = props => {
  const {each} = props
  const {
    similarCompanyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    rating,
    title,
  } = each

  return (
    <li className="similar-job-card">
      <div className="upper">
        <div>
          <img
            src={similarCompanyLogoUrl}
            alt="company"
            className="company-logo"
          />
        </div>
        <div className="job-rating-container">
          <h1 className="heading">{title}</h1>
          <div className="rating-container">
            <BsFillStarFill className="star" />
            <p className="para">{rating}</p>
          </div>
        </div>
      </div>
      <div>
        <h1 className="heading">{title}</h1>
        <p className="para">{jobDescription}</p>
      </div>
      <div className="middle">
        <div className="icon-container">
          <HiLocationMarker className="icon" />
          <p className="para">{location}</p>
        </div>
        <div className="icon-container">
          <BsFillBriefcaseFill className="icon" />
          <p className="para">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJob
