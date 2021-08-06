import React, {useContext, useState} from "react";

const OverlayContext = React.createContext()

export const useOverlay = () => {
    return useContext(OverlayContext)
}

export const OverlayProvider = ({children}) => {
    const [isVisible, setIsVisible] = useState(false)

    return <OverlayContext.Provider value={{
        isVisible,
        closeOverlay: () => setIsVisible(false),
        showOverlay: () => setIsVisible(true)
    }}>
        {children}
    </OverlayContext.Provider>
}
