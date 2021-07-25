import React, {useRef} from 'react';
import {useOverlay} from "../../context/OverlayContext";
import './Overlay.css'

const Overlay = ({children}) => {

    const {isVisible, closeOverlay} = useOverlay()
    const overlayRef = useRef(null)

    const handleClose = event => {
        if (event.target === overlayRef.current)
            closeOverlay()
    }

    if (!isVisible) return null

    return <div id="overlay" onClick={handleClose} ref={overlayRef}>{children}</div>
};

export default Overlay;
