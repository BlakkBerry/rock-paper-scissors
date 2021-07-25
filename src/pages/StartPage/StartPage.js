import React, {useRef} from 'react';
import Overlay from "../Overlay/Overlay";
import {Link, useHistory} from "react-router-dom";
import {useOverlay} from "../../context/OverlayContext";

const StartPage = () => {

    const {showOverlay, closeOverlay} = useOverlay()
    const inputRef = useRef()
    const history = useHistory()

    return (
        <>
            <div className="container centered">
                <div className="buttons">
                    <div className="button circle action" id="top-circle">
                        <Link to="/game" style={{textDecoration: 'none'}}>
                            <div className="text">Play</div>
                        </Link>
                    </div>
                    <div className="button circle action" id="left-circle">
                        <p className="text">Create</p>
                    </div>
                    <div className="button circle action" id="right-circle">
                        <div className="text" id="join" onClick={() => showOverlay()}>Join</div>
                    </div>
                </div>
            </div>
            <Overlay>
                <div className="join">
                    <div className="join__content">
                        <p className="text">Enter Game Code:</p>
                        <form className="join__form">
                            <input maxLength='7' placeholder="D2dQyC9" className="gamecode" ref={inputRef}/>
                            <div className="join__btn" onClick={() => {
                                closeOverlay()

                                history.push(`lobby/${inputRef.current.value}`)
                            }}>Join
                            </div>
                        </form>
                    </div>
                </div>
            </Overlay>
        </>
    );
};

export default StartPage;
