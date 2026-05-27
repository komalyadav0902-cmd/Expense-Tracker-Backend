import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/api'

function Login() {

  // useState creates a state variable
  // [value, setter] = useState(initialValue)
  // When setter is called, React re-renders the component with new value
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // useNavigate gives you a function to programmatically change the page
  // like window.location.href but for React Router
  const navigate = useNavigate()

  // This function runs when the form is submitted
  const handleLogin = async (e) => {
    e.preventDefault() // stops the browser from refreshing the page on form submit

    setError('')        // clear any previous error
    setLoading(true)    // show loading state on button

    try {
      // api.post() sends a POST request to /auth/login
      // with { email, password } as the request body
      // your Spring Boot backend returns { token: "eyJ..." }
      const response = await api.post('/auth/login', { email, password })

      // store the token in localStorage so it persists across pages
      localStorage.setItem('token', response.data.token)

      // redirect to dashboard after successful login
      navigate('/dashboard')

    } catch (err) {
      // if backend returns 401 or any error, show it to user
      setError('Invalid email or password')
    } finally {
      setLoading(false) // always stop loading whether success or fail
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>💰 Expense Tracker</h2>

        {/* onSubmit runs handleLogin when form is submitted */}
        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Email</label>
            {/* 
              value={email} → controlled input, React controls what's shown
              onChange → every keypress updates the email state
              This is called a CONTROLLED COMPONENT
            */}
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Only show error message if error is not empty string */}
          {error && <p className="error-msg">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        <div className="link-text">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  )
}

export default Login