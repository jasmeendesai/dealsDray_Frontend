import { useState } from 'react'
import style from './register.module.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"

function Register() {

    const [inputs, setInputs] = useState({
        username : "",
        name : "",
        email : "",
        password : ""
      })

      const [err, setErr] = useState(null)
      const navigate = useNavigate()
    
      const handleChange = e =>{
        setInputs(prev=> ({...prev, [e.target.name] : e.target.value}))
      }
    
      const handleClick =async e =>{
        e.preventDefault();
        if (!inputs.username || !inputs.email || !inputs.password || !inputs.name) {
          setErr("Please fill in all the details");
          return;
        }
        try {
          await axios.post("https://aware-satisfying-belly.glitch.me/api/admin/register", inputs)
          navigate("/login")
        } catch (err) {
          setErr(err.response.data)
        }
      }
  return (
    <div className={style.container}>
    <h1>Register</h1>
  <form>
    <label>User Name</label>
    <input type="text" name='username' value={inputs.username} onChange={handleChange} />
    <br />
    <label>Name</label>
    <input type="text" name='name' value={inputs.name} onChange={handleChange} />
    <br />
    <label>Email</label>
    <input type="email" name='email' value={inputs.email} onChange={handleChange} />
    <br />
    <label >Password</label>
    <input type="password" name='password' value={inputs.password} onChange={handleChange}  />
    <br />
    <div className={style.login}>
        <span>Do you have an account?</span>
          <Link style={{color : "black"}} to="/login">
            Login
          </Link>
    </div>
    {err && err}
    <button onClick={handleClick}>Register</button>
  </form>
</div>
  )
}

export default Register
