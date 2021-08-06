import React, {useContext, useRef, useState} from "react";

const LoaderContext = React.createContext()

export const useLoader = () => {
    return useContext(LoaderContext)
}

export const LoaderProvider = ({children}) => {

    const [isLoading, setIsLoading] = useState(false)
    const animationDuration = useRef(0)

    const loadPage = () => {
        return new Promise(resolve => {
            setIsLoading(true)

            setTimeout(() => {
                resolve()
            }, animationDuration.current / 3)

            setTimeout(() => {
                setIsLoading(false)
            }, animationDuration.current)
        })
    }

    const setDuration = duration => {
        animationDuration.current = duration * 1000
    }

    return <LoaderContext.Provider value={{isLoading, loadPage: loadPage, setDuration: setDuration}}>
        {children}
    </LoaderContext.Provider>
}
