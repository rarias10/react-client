import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('')
  const dispatch=useDispatch(); const nav=useNavigate()
  const { status, error } = useSelector(s=>s.auth)
  const onSubmit=async(e)=>{ e.preventDefault(); const r=await dispatch(loginUser({email,password})); if(r.type.endsWith('fulfilled')) nav('/') }
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={onSubmit} style={{ display:'grid', gap:8, maxWidth:360 }}>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button disabled={status==='loading'}>{status==='loading'?'Signing in…':'Login'}</button>
        {error && <p style={{color:'crimson'}}>{error.error || 'Login failed'}</p>}
      </form>
    </div>
  )
}
