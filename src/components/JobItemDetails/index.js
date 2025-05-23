import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: 'INITIAL', // IN_PROGRESS, SUCCESS, FAILURE
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: 'IN_PROGRESS'})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const jobDetails = this.formatJobData(data.job_details)
      const similarJobs = data.similar_jobs.map(this.formatJobData)

      this.setState({
        jobDetails,
        similarJobs,
        apiStatus: 'SUCCESS',
      })
    } else {
      this.setState({apiStatus: 'FAILURE'})
    }
  }

  formatJobData = data => ({
    id: data.id,
    title: data.title,
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    rating: data.rating,
    location: data.location,
    employmentType: data.employment_type,
    packagePerAnnum: data.package_per_annum,
    jobDescription: data.job_description,
    skills: data.skills?.map(skill => ({
      name: skill.name,
      imageUrl: skill.image_url,
    })),
    lifeAtCompany: data.life_at_company
      ? {
          description: data.life_at_company.description,
          imageUrl: data.life_at_company.image_url,
        }
      : {},
  })

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-button" onClick={this.getJobsData}>
        Retry
      </button>
    </div>
  )

  renderSkills = skills => (
    <ul className="skills-list">
      {skills.map(skill => (
        <li key={skill.name} className="skill-item">
          <img src={skill.imageUrl} alt={skill.name} className="skill-icon" />
          <p>{skill.name}</p>
        </li>
      ))}
    </ul>
  )

  renderSimilarJobs = similarJobs => (
    <ul className="similar-jobs-list">
      {similarJobs.map(job => (
        <li key={job.id} className="similar-job-item">
          <img src={job.companyLogoUrl} alt="similar job company logo" />
          <h3>{job.title}</h3>
          <p>Rating: {job.rating}</p>
          <p>
            {job.location} | {job.employmentType}
          </p>
          <p>{job.jobDescription}</p>
        </li>
      ))}
    </ul>
  )

  renderJobDetails = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      title,
      companyLogoUrl,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
    } = jobDetails

    return (
      <>
        <Header />

        <div className="job-details-container">
          <div className="job-header">
            <img src={companyLogoUrl} alt="company logo" />
            <div>
              <h2>{title}</h2>
              <p>Rating: {rating}</p>
            </div>
          </div>
          <div className="job-info">
            <p>{location}</p>
            <p>{employmentType}</p>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="job-desc">
            <h1>Description</h1>
            <a
              href={companyWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button type="button">Visit</button>
            </a>
            <p>{jobDescription}</p>
          </div>
          <h3>Skills</h3>
          {this.renderSkills(skills)}

          <div className="life-at-company">
            <h3>Life at Company</h3>
            <p>{lifeAtCompany.description}</p>
            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>

          <h2>Similar Jobs</h2>
          {this.renderSimilarJobs(similarJobs)}
        </div>
      </>
    )
  }

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case 'SUCCESS':
        return this.renderJobDetails()
      case 'FAILURE':
        return this.renderFailureView()
      case 'IN_PROGRESS':
        return this.renderLoader()
      default:
        return null
    }
  }
}

export default JobItemDetails
