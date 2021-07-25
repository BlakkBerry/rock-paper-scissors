import React, {useState, useContext} from "react";
import Cookies from "universal-cookie/es6";

const cookies = new Cookies()
const username = cookies.get('User')

const UserContext = React.createContext()

export const useUserContext = () => useContext(UserContext)

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(username)

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}
