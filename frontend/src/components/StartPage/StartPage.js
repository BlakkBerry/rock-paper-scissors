import React, {useEffect, useRef} from 'react';
import Overlay from "../Overlay/Overlay";
import {useOverlay} from "../../context/OverlayContext";
import {useNavigator} from "../../hooks/useNavigator";
import Navigation from "../Navigation";
import {useConnection} from "../../context/ConnectionContext";

const StartPage = () => {

    const {showOverlay, closeOverlay} = useOverlay()
    const navigator = useNavigator()
    const inputRef = useRef()
    const {connection} = useConnection()

    useEffect(() => {
        if (!connection) return

        connection.on('GameCreated', code => {
            console.log('Game is created!')

            navigator.navigate(`/lobby/${code}`)
        })
    }, [connection])

    const createGame = () => connection.send('CreateGame')


    return (
        <>
            <div className="container centered">
                <div className="buttons">
                    <Navigation to="/game">
                        <div className="button circle action" id="top-circle">
                            <div className="text">Play</div>
                        </div>
                    </Navigation>
                    <div className="button circle action" id="left-circle"
                         onClick={createGame}>
                        <p className="text">Create</p>
                    </div>
                    <div className="button circle action" id="right-circle" onClick={() => showOverlay()}>
                        <div className="text" id="join">Join</div>
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
