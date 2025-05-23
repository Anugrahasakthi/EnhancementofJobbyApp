// src/components/JobCard/index.js
import {Link} from 'react-router-dom'
import './index.css'

const JobCard = ({jobDetails}) => {
  const {
    id,
    title,
    companyLogoUrl,
    location,
    rating,
    employmentType,
    jobDescription,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="job-card-link">
      <div className="job-card">
        <img src={companyLogoUrl} alt={title} className="job-card-img" />
        <div className="job-card-info">
          <h3 className="job-card-title">{title}</h3>
          <p className="job-card-location">{location}</p>
          <p className="job-card-rating">{rating} ⭐</p>
          <p className="job-card-type">{employmentType}</p>
          <p className="job-card-description">{jobDescription}</p>
        </div>
      </div>
    </Link>
  )
}

export default JobCard
