import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobItem from '../JobItem'
import FilterGroup from '../FilterGroup'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  noJob: 'NO_JOB',
}

class Jobs extends Component {
  state = {
    salaryRange: '',
    employmentType: [],
    minimumPackage: '',
    profileStatus: apiStatusConstants.initial,
    profileDetails: {},
    jobsStatus: apiStatusConstants.initial,
    jobsData: [],
    searchInput: '',
  }

  componentDidMount = () => {
    this.getTheData()
  }

  getTheData = async () => {
    this.setState({
      profileDetails: apiStatusConstants.isLoading,
      jobsStatus: apiStatusConstants.isLoading,
    })
    const {salaryRange} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const apiUrl = 'https://apis.ccbp.in/profile'

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const profileDetails = data.profile_details
      console.log(profileDetails)
      const profileDetails2 = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      console.log(profileDetails2)
      this.setState({
        profileDetails: profileDetails2,
        profileStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        profileStatus: apiStatusConstants.failure,
      })
    }

    const {employmentType, minimumPackage, searchInput} = this.state

    const apiUrlJobs = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minimumPackage}&search=${searchInput}`

    const jobsResponse = await fetch(apiUrlJobs, options)
    if (jobsResponse.ok) {
      const jobsData = await jobsResponse.json()
      const {jobs} = jobsData
      console.log(jobs)

      const updatedJobs = jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      if (updatedJobs === []) {
        this.setState({jobsStatus: apiStatusConstants.noJob})
      } else {
        this.setState({
          jobsData: updatedJobs,
          jobsStatus: apiStatusConstants.success,
        })
      }
    } else {
      this.setState({
        jobsStatus: apiStatusConstants.failure,
      })
    }
  }

  profileStatusSuccess = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchButton = () => {
    const {searchInput} = this.state
    this.setState({searchInput}, this.getTheData)
  }

  jobsStatusFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="heading">Oops! Something Went Wrong</h1>
      <p className="para">
        We cannot seem to find the page you are looking for
      </p>
      <div>
        <button
          type="button"
          className="login-button"
          onClick={this.getTheData}
        >
          Retry
        </button>
      </div>
    </div>
  )

  jobsStatusSuccess = () => {
    const {jobsData, searchInput} = this.state

    const updatedList = jobsData.filter(each =>
      each.title.toLowerCase().startsWith(searchInput),
    )
    return (
      <>
        <div className="search-bar-container">
          <input
            type="search"
            onChange={this.onChangeSearch}
            value={searchInput}
            className="search-input"
            placeholder="title"
          />
          <button
            className="search-icon-container"
            onClick={this.onClickSearchButton}
            type="button"
            testid="searchButton"
          >
            <BsSearch className="search-icon" />
          </button>
        </div>

        <ul className="unordered-list">
          {updatedList.map(each => (
            <JobItem each={each} key={each.id} />
          ))}
        </ul>
      </>
    )
  }

  jobsStatusNoJobs = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="heading">No Jobs Found</h1>
      <p className="para">We could not find any jobs. Try other filters</p>
    </div>
  )

  profileStatusLoading = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  jobsStatusLoading = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  profileStatusFailure = () => <div>failed</div>

  renderProfile = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case apiStatusConstants.inProgress:
        return this.profileStatusLoading()
      case apiStatusConstants.success:
        return this.profileStatusSuccess()
      case apiStatusConstants.failure:
        return this.profileStatusFailure()

      default:
        return null
    }
  }

  renderJobs = () => {
    const {jobsStatus} = this.state
    switch (jobsStatus) {
      case apiStatusConstants.inProgress:
        return this.jobsStatusLoading()
      case apiStatusConstants.success:
        return this.jobsStatusSuccess()
      case apiStatusConstants.failure:
        return this.jobsStatusFailure()
      case apiStatusConstants.noJob:
        return this.jobsStatusNoJobs()

      default:
        return null
    }
  }

  onChangeEmploymentType = () => {
    console.log('hii')
  }

  renderFilterGroup = () => (
    <div className="filter-group-container">
      <div className="employment-container">
        <hr />
        <p className="para">Types of employment</p>
        <ul className="unordered-list">
          {employmentTypesList.map(each => (
            <FilterGroup
              onChangeEmploymentType={this.onChangeEmploymentType}
              each={each}
            />
          ))}
        </ul>
      </div>
      <div className="employment-container">
        <hr />
        <p className="para">Types of employment</p>
        {employmentTypesList.map(each => (
          <FilterGroup
            onChangeEmploymentType={this.onChangeEmploymentType}
            each={each}
          />
        ))}
      </div>
    </div>
  )

  render() {
    const {isLoading} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="left">
            {this.renderProfile()}
            <FilterGroup onChangeEmploymentType={this.onChangeEmploymentType} />
          </div>
          <div className="right">{this.renderJobs()}</div>
        </div>
      </>
    )
  }
}

export default Jobs
