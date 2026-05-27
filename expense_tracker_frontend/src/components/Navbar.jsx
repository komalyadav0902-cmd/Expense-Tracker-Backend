import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Remove token from localStorage — user is now logged out
    localStorage.removeItem('token')
    // Redirect to login page
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">💰 Expense Tracker</div>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/analytics">Analytics</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}

export default Navbar