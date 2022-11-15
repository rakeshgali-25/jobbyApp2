import './index.css'

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

const FilterGroup = props => {
  const renderEmploymentList = each => {
    const {onChangeEmploymentType} = props
    const {employmentTypeId, label} = each
    const onChangeEmployment = () => {
      onChangeEmploymentType(each)
    }
    return (
      <li
        className="checkbox-container"
        value={employmentTypeId}
        key={employmentTypeId}
      >
        <input
          type="checkbox"
          id={label}
          className="checkbox-input"
          onChange={onChangeEmployment}
        />
        <label htmlFor={each.label} className="para">
          {label}
        </label>
      </li>
    )
  }

  const renderEmploymentType = () => (
    <div className="type-container">
      <h1 className="heading">Type of Employment</h1>
      <ul className="types-list">
        {employmentTypesList.map(each => renderEmploymentList(each))}
      </ul>
    </div>
  )

  const renderRange = each => {
    const {onClickSalaryRange} = props
    const rangeClicked = () => {
      onClickSalaryRange(each)
    }
    return (
      <li
        className="checkbox-container"
        value={each.salaryRangeId}
        key={each.salaryRangeId}
        onClick={rangeClicked}
      >
        <input
          type="radio"
          id={each.label}
          className="checkbox-input"
          name="radio"
        />
        <label htmlFor={each.label} className="para">
          {each.label}
        </label>
      </li>
    )
  }

  const renderSalaryRange = () => (
    <div className="type-container">
      <h1 className="heading">Salary Range</h1>
      <ul className="types-list">
        {salaryRangesList.map(each => renderRange(each))}
      </ul>
    </div>
  )

  return (
    <div className="filter-container">
      <hr />
      {renderEmploymentType()}
      <hr />
      {renderSalaryRange()}
    </div>
  )
}

export default FilterGroup
