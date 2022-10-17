import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

class Login extends Component {
  state = {username: '', password: '', showErrorMsg: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value, showErrorMsg: false})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value, showErrorMsg: false})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({username: '', password: '', showErrorMsg: true, errorMsg})
  }

  onClickSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()
    console.log(response)
    console.log(data.jwt_token)
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showErrorMsg, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bg-container">
        <form className="form-container" onSubmit={this.onClickSubmit}>
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-logo"
            />
          </div>

          <div className="label-container">
            <label htmlFor="username" className="label">
              USERNAME
            </label>
            <input
              type="text"
              className="input"
              placeholder="Username"
              id="username"
              value={username}
              onChange={this.onChangeUsername}
            />
          </div>
          <div className="label-container">
            <label htmlFor="password" className="label">
              PASSWORD
            </label>
            <input
              type="password"
              className="input"
              placeholder="Password"
              id="password"
              value={password}
              onChange={this.onChangePassword}
            />
          </div>
          <div>
            <button type="submit" className="login-button">
              login
            </button>
            {showErrorMsg && <p className="error-message">*{errorMsg}</p>}
          </div>
        </form>
      </div>
    )
  }
}

export default Login
