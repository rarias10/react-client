import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
export default function Register(){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('')
  const dispatch=useDispatch(); const nav=useNavigate()
  const { status, error } = useSelector(s=>s.auth)
  const onSubmit=async(e)=>{ e.preventDefault(); const r=await dispatch(registerUser({name,email,password})); if(r.type.endsWith('fulfilled')) nav('/login') }
  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={onSubmit} style={{ display:'grid', gap:8, maxWidth:360 }}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button disabled={status==='loading'}>{status==='loading'?'Creating…':'Create account'}</button>
        {error && <p style={{color:'crimson'}}>{error.error || 'Registration failed'}</p>}
      </form>
    </div>
  )
}
