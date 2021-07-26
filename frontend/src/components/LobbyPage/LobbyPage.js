import React, {useState, useRef, useEffect} from 'react';
import Overlay from "../Overlay/Overlay";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import './LobbyPage.css'
import {faCheckCircle, faStar, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {useOverlay} from "../../context/OverlayContext";
import {useLoader} from "../../context/LoaderContext";

const LobbyPage = () => {
    const [username, setUsername] = useState('')
    const [ready, setReady] = useState(false)
    const {showOverlay, closeOverlay} = useOverlay()
    const {loadPage} = useLoader()
    const inputRef = useRef()
    const readyBtnRef = useRef()

    useEffect(() => {
        showOverlay()
    }, [])

    return (
        !username ?
            <Overlay duration={0}>
                <div className="join">
                    <div className="join__content">
                        <p className="text">Enter Your Name:</p>
                        <form className="join__form">
                            <input type="text" className="nickname-input" maxLength={22} ref={inputRef}/>
                            <div className="join__btn" onClick={() => {
                                if (inputRef.current) {
                                    loadPage().then(() => {
                                        setUsername(inputRef.current)
                                        closeOverlay()
                                    })
                                }
                            }}>Join
                            </div>
                        </form>
                    </div>
                </div>
            </Overlay>
            :
            <div className="container">
                <div className="gameinfo">
            <span className="gameinfo__title text">
                Rock Paper Scissors
            </span>
                    <div className="gameinfo__additional">
                        Username: Juice
                    </div>

                    <div className="gameinfo__additional">
                        Game Code: HDs2dfZ
                    </div>

                    <div className={`gameinfo__ready ${ready ? 'ready' : 'not-ready'}`}
                         onClick={() => setReady(prev => !prev)}
                         ref={readyBtnRef}
                    >
                        {ready ? 'Ready' : 'Not Ready'}
                    </div>

                    <div className="gameinfo__players">
                        <div className="gameinfo__player">
                            <div className="gameinfo__icon">
                                <FontAwesomeIcon icon={faStar} style={{padding: '0 10px 0 0'}}/>
                            </div>
                            <div className="gameinfo__nickname">
                                Test
                            </div>
                            <div className="gameinfo__readyness">
                                <FontAwesomeIcon icon={faCheckCircle}/>
                            </div>
                        </div>
                        <div className="gameinfo__player">
                            <div className="gameinfo__nickname">
                                Test
                            </div>
                            <div className="gameinfo__readyness">
                                <FontAwesomeIcon icon={faTimesCircle}/>
                            </div>
                        </div>
                        <div className="gameinfo__player">
                            <div className="gameinfo__nickname">
                                Test
                            </div>
                            <div className="gameinfo__readyness">
                                <FontAwesomeIcon icon={faTimesCircle}/>
                            </div>
                        </div>
                        <div className="gameinfo__player">
                            <div className="gameinfo__nickname">
                                Test
                            </div>
                            <div className="gameinfo__readyness">
                                <FontAwesomeIcon icon={faTimesCircle}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default LobbyPage;
