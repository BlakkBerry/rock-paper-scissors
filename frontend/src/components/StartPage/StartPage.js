import React, {useEffect, useRef} from 'react';
import Overlay from "../Overlay/Overlay";
import {useOverlay} from "../../context/OverlayContext";
import {useNavigator} from "../../hooks/useNavigator";
import Navigation from "../Navigation";
import {useConnection} from "../../context/ConnectionContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDungeon, faGamepad, faLaptopHouse} from "@fortawesome/free-solid-svg-icons";

const StartPage = () => {

    const {showOverlay, closeOverlay} = useOverlay()
    const navigator = useNavigator()
    const inputRef = useRef()
    const {connection, connectionState} = useConnection()

    useEffect(() => {
        if (!connection || connectionState !== 'Connected') return

        connection.on('GameCreated', code => {
            console.log('Game is created!')

            navigator.navigate(`/lobby/${code}`)
        })

    }, [connection, connectionState])

    return (
        <>
            <div className="container centered">
                <div className="buttons">
                    <Navigation to="/game">
                        <div className="button circle action" id="top-circle">
                            <div className="text">Play</div>
                            <div className="bg-icon">
                                <FontAwesomeIcon icon={faGamepad} />
                            </div>
                        </div>
                    </Navigation>
                    <div className="button circle action" id="left-circle"
                         onClick={() => connection.send('CreateGame')}>
                        <p className="text">Create</p>
                        <div className="bg-icon">
                            <FontAwesomeIcon icon={faLaptopHouse} />
                        </div>
                    </div>
                    <div className="button circle action" id="right-circle" onClick={() => showOverlay()}>
                        <div className="text" id="join">
                            Join
                        </div>
                        <div className="bg-icon">
                            <FontAwesomeIcon icon={faDungeon} />
                        </div>
                    </div>
                </div>
            </div>
            <Overlay>
                <div className="join">
                    <div className="join__content">
                        <p className="text">Enter Game Code:</p>
                        <form className="join__form">
                            <input maxLength='8' placeholder="D2dQyC9S" className="gamecode" ref={inputRef}/>
                            <div className="join__btn" onClick={() => {
                                navigator.navigate(`/lobby/${inputRef.current.value}`).then(() => {
                                    closeOverlay()
                                })
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
