import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || false
    );

    const login = async (inputs)=>{
        const res = await axios.post("https://aware-satisfying-belly.glitch.me/api/admin/login", inputs, {
            withCredentials :true,
        })
        setCurrentUser(res.data)
    }

    const logout = async (inputs)=>{
        const res = await axios.post("https://aware-satisfying-belly.glitch.me/api/admin/logout", {}, {
            withCredentials :true,
        })

        setCurrentUser(false)
    }

    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return(
        <AuthContext.Provider value={{currentUser, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}