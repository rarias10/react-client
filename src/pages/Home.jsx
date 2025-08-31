import { useSelector } from 'react-redux'
export default function Home(){
  const user = useSelector(s=>s.auth.user)
  const isAuth = useSelector(s=>s.auth.isAuthenticated)
  return (
    <div>
      <h1>Home</h1>
      {isAuth ? <p>Welcome {user?.name || 'User'}! You are logged in.</p> : <p>Please login or register.</p>}
    </div>
  )
}
