import style from './navbar.module.css'
import logo from '../../assets/logo.jpg'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';

function Navbar() {
  const {currentUser, logout} = useContext(AuthContext)

  const [err, setErr] = useState(null);
  const navigate = useNavigate()

  const handleLogout = async e =>{
    e.preventDefault()
    try {
      await logout();      
      localStorage.removeItem("user")
      navigate("/login")
    } catch (err) {
      setErr(err.response.data);
    }
  }

  return (
    <div className={style.container}>
      <div className={style.logo}>
        <img src={logo} alt="" />
      </div>
      <div className={style.routes}>
        <Link style={{textDecoration : "none"}} to="/"><span>Home</span></Link>
        <Link style={{textDecoration : "none"}} to="/employee"><span>Employee List</span></Link>      
      </div>
      <div className={style.name}>
        <p>{currentUser.data.f_userName}</p>
      </div>
      <div className={style.logout}>
        <ExitToAppIcon/>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar
