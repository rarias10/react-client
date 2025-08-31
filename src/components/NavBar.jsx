import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutLocal } from '../features/auth/authSlice'
export default function NavBar(){
  const isAuth = useSelector(s=>s.auth.isAuthenticated)
  const dispatch = useDispatch()
  return (
    <nav style={{ display:'flex', gap:12, padding:'12px 0' }}>
      <Link to="/">Home</Link>
      {!isAuth && <Link to="/login">Login</Link>}
      {!isAuth && <Link to="/register">Register</Link>}
      {isAuth && <button onClick={()=>dispatch(logoutLocal())}>Logout</button>}
    </nav>
  )
}
