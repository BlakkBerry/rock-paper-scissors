import React, {useRef} from 'react';
import {useOverlay} from "../../context/OverlayContext";
import './Overlay.css'

const Overlay = ({children, onClick, duration = 1}) => {

    const {isVisible} = useOverlay()
    const overlayRef = useRef(null)

    if (!isVisible) return null

    return <div id="overlay"
                onClick={onClick}
                ref={overlayRef}
                style={{animationDuration: `${duration}s`}}>{children}</div>
};

export default Overlay;
