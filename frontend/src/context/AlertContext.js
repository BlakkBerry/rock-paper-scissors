import React, {useContext, useRef, useState} from "react";

const AlertContext = React.createContext()

export const useAlert = () => {
    return useContext(AlertContext)
}

export const AlertProvider = ({children}) => {
    const [isVisible, setIsVisible] = useState(false)
    const [message, setMessage] = useState('')
    const prevTimer = useRef()

    const showAlert = (text) => {
        text && setMessage(text)
        setIsVisible(true)

        if (prevTimer.current) {
            clearTimeout(prevTimer.current)
        }

        prevTimer.current = setTimeout(() => {
            setIsVisible(false)
        }, 4000)
    }
    const hideAlert = () => {
        setIsVisible(false)

        if (prevTimer.current) {
            clearTimeout(prevTimer.current)
        }
    }


    return <AlertContext.Provider value={{isVisible, showAlert, hideAlert, message}}>
        {children}
    </AlertContext.Provider>
}
