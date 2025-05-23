import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaSearch} from 'react-icons/fa'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import ProfileCard from '../ProfileCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileCardDetails: '',
    profileStatus: apiStatusConstants.initial,
    selectedEmployeeTypes: [],
    selectedSalaryRange: '',
    searchQuery: '',
    jobList: [], // Added jobList to hold job data
    jobStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobList()
  }

  onSearchChange = event => {
    this.setState({searchQuery: event.target.value})
  }

  // You can also add a function to handle search logic if needed
  handleSearch = () => {
    this.getJobList()
  }

  getProfileData = async () => {
    this.setState({profileStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const data = await response.json()
        const profile = data.profile_details
        const updatedProfile = {
          name: profile.name,
          profileImageUrl: profile.profile_image_url,
          shortBio: profile.short_bio,
        }
        this.setState({
          profileCardDetails: updatedProfile,
          profileStatus: apiStatusConstants.success,
        })
      } else {
        const errorData = await response.json()
        this.setState({
          profileStatus: apiStatusConstants.failure,
          errorMessage: errorData.error_msg || 'Failed to load profile.',
        })
      }
    } catch (error) {
      this.setState({
        profileStatus: apiStatusConstants.failure,
        errorMessage: error.message || 'Something went wrong.',
      })
    }
  }

  onChangeSalaryRange = event => {
    this.setState({selectedSalaryRange: event.target.value}, this.getJobList)
  }

  onChangeEmployeeType = event => {
    const {value, checked} = event.target
    const {selectedEmployeeTypes} = this.state

    const updatedList = checked
      ? [...selectedEmployeeTypes, value]
      : selectedEmployeeTypes.filter(type => type !== value)

    this.setState({selectedEmployeeTypes: updatedList}, this.getJobList)
  }

  renderSalaryRangeFilters = () => {
    const {selectedSalaryRange} = this.state
    const {salaryRangesList} = this.props // Salary ranges list passed as prop

    return (
      <div>
        <h3>Select Salary Range</h3>
        <ul className="radio-list">
          {salaryRangesList.map(eachSalaryRange => (
            <li key={eachSalaryRange.salaryRangeId}>
              <input
                type="radio"
                id={eachSalaryRange.salaryRangeId}
                name="salaryRange" // Radio buttons with the same name belong to the same group
                value={eachSalaryRange.salaryRangeId}
                checked={selectedSalaryRange === eachSalaryRange.salaryRangeId} // Check if this radio button is selected
                onChange={this.onChangeSalaryRange}
              />
              <label htmlFor={eachSalaryRange.salaryRangeId}>
                {eachSalaryRange.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderEmployeeTypeFilters = () => {
    const {employmentTypesList} = this.props
    const {selectedEmployeeTypes} = this.state

    return (
      <div className="employee-type-filters">
        <h3 className="filter-title">Type of Employment</h3>
        <ul className="checkbox-list">
          {employmentTypesList.map(eachType => (
            <li key={eachType.employmentTypeId}>
              <input
                type="checkbox"
                id={eachType.employmentTypeId}
                value={eachType.employmentTypeId}
                checked={selectedEmployeeTypes.includes(
                  eachType.employmentTypeId,
                )}
                onChange={this.onChangeEmployeeType}
              />
              <label htmlFor={eachType.employmentTypeId}>
                {eachType.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  getJobList = async () => {
    const {selectedEmployeeTypes, selectedSalaryRange, searchQuery} = this.state
    const employmentTypes = selectedEmployeeTypes.join(',')
    let apiUrl = 'https://apis.ccbp.in/jobs?'

    if (employmentTypes) apiUrl += `employment_type=${employmentTypes}&`
    if (selectedSalaryRange) apiUrl += `minimum_package=${selectedSalaryRange}&`
    if (searchQuery) apiUrl += `search=${searchQuery}`

    if (apiUrl.endsWith('&')) apiUrl = apiUrl.slice(0, -1)

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const data = await response.json()
        // Map API data to camelCase keys
        const updatedJobs = data.jobs.map(job => ({
          id: job.id,
          title: job.title,
          companyLogoUrl: job.company_logo_url,
          location: job.location,
          rating: job.rating,
          employmentType: job.employment_type,
          packagePerAnnum: job.package_per_annum,
          jobDescription: job.job_description,
        }))
        this.setState({
          jobList: updatedJobs,
          jobStatus: apiStatusConstants.success,
        })
      } else {
        const errorData = await response.json()
        this.setState({
          jobStatus: apiStatusConstants.failure,
          errorMessage: errorData.error_msg || 'Failed to load jobs.',
        })
      }
    } catch (error) {
      this.setState({
        jobStatus: apiStatusConstants.failure,
        errorMessage: error.message || 'Something went wrong.',
      })
    }
  }

  renderJobList = () => {
    const {jobList} = this.state
    return (
      <>
        <ul className="jobs-list">
          {jobList.map(job => (
            <li key={job.id} className="job-card">
              <Link to={`/jobs/${job.id}`} className="job-link">
                <div className="job-header">
                  <img src={job.companyLogoUrl} alt="company logo" />
                  <div>
                    <h3>{job.title}</h3>
                    <p>Rating: {job.rating}</p>
                  </div>
                </div>
                <p>
                  {job.location} | {job.employmentType}
                </p>
                <p>{job.packagePerAnnum}</p>
                <p>{job.jobDescription}</p>
              </Link>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderProfileSection = () => {
    const {profileStatus, profileCardDetails, errorMessage} = this.state

    switch (profileStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div data-testid="loader" className="loader-container">
            <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
          </div>
        )
      case apiStatusConstants.success:
        return <ProfileCard profileDetails={profileCardDetails} />
      case apiStatusConstants.failure:
        return (
          <div className="failure-view">
            <p>{errorMessage}</p>
            <button type="button" onClick={this.getProfileData}>
              Retry
            </button>
          </div>
        )
      default:
        return null
    }
  }

  renderJobSection = () => {
    const {jobStatus, errorMessage} = this.state

    switch (jobStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div data-testid="loader">
            <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
          </div>
        )
      case apiStatusConstants.success:
        return this.renderJobList()
      case apiStatusConstants.failure:
        return (
          <div className="failure-view">
            <p>{errorMessage}</p>
            <button type="button" onClick={this.getJobList}>
              Retry
            </button>
          </div>
        )
      default:
        return null
    }
  }

  render() {
    const {searchQuery} = this.state
    return (
      <>
        <Header />
        <div className="job-container">
          <div className="left-cont">
            {this.renderProfileSection()}
            <hr className="styled-hr" />
            {this.renderEmployeeTypeFilters()}
            <hr className="styled-hr" />
            {this.renderSalaryRangeFilters()}
          </div>
          <div className="right-cont">
            <div className="search-container">
              <input
                type="search"
                value={searchQuery}
                onChange={this.onSearchChange}
                className="search-input"
                placeholder="Search jobs..."
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.handleSearch}
              >
                <FaSearch />
              </button>
            </div>
            {this.renderJobSection()}
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
