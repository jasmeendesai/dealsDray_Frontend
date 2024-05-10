import { useContext, useState } from 'react'
import style from './login.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'

function Login() {

    const [inputs, setInputs] = useState({
        username : "",
        password : ""
      })

      const {login} = useContext(AuthContext)
      const [err, setErr] = useState(null)

  const navigate = useNavigate()
    
      const handleChange = e =>{
        setInputs(prev=> ({...prev, [e.target.name] : e.target.value}))
      }
    
      const handleClick =async e =>{
        e.preventDefault()
        try {
          await login(inputs);
          navigate("/")
        } catch (err) {
          setErr(err.response.data)
        }
      }
    
  return (
    <div className={style.container}>
        <h1>Login</h1>
      <form>
        <label>User Name</label>
        <input type="text" name='username' value={inputs.username} onChange={handleChange} />
        <br />
        <label >Password</label>
        <input type="password" name='password' value={inputs.password} onChange={handleChange}  />
        <br />
        <div className={style.register}>
        <span>New User?</span>
          <Link style={{color : "black"}} to="/register">
            Register
          </Link>
        </div>
        {err && err}
        <button onClick={handleClick}>Login</button>
      </form>
    </div>
  )
}

export default Login
