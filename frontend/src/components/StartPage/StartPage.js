import React, {useEffect, useRef, useState} from 'react';
import Overlay from "../Overlay/Overlay";
import {useOverlay} from "../../context/OverlayContext";
import {useNavigator} from "../../hooks/useNavigator";
import Navigation from "../Navigation";
import {HubConnectionBuilder} from "@microsoft/signalr";

const StartPage = () => {

    const {showOverlay, closeOverlay} = useOverlay()
    const navigator = useNavigator()
    const inputRef = useRef()


    const [connection, setConnection] = useState()

    useEffect(() => {
        const conn = new HubConnectionBuilder()
            .withUrl('https://localhost:5001/hubs/rps')
            .withAutomaticReconnect()
            .build();

        setConnection(conn)
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected!');
                })
                .catch(e => console.log('Connection failed: ', e));

            connection.on('GameJoined', code => {
                console.log('game joined with code', code)
            })
        }
    }, [connection]);

    return (
        <>
            <button onClick={() => connection.send('JoinGame', '123qwe')}>JOIN</button>
            <div className="container centered">
                <div className="buttons">
                    <div className="button circle action" id="top-circle">
                        <Navigation to="/game">
                            <div className="text">Play</div>
                        </Navigation>
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
                                navigator.navigate(`lobby/${inputRef.current.value}`).then(() => {
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
