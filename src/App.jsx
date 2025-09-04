import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { useSelector } from 'react-redux'
export default function App() {
  const isAuth = useSelector(state => state.auth.isAuthenticated)
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={isAuth ? <Navigate to="/"/> : <Login/>}/>
        <Route path="/register" element={isAuth ? <Navigate to="/"/> : <Register/>}/>
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </div>
  )
}
