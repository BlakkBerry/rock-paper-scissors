import React, {useEffect, useRef, useState} from 'react';
import Overlay from "../Overlay/Overlay";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import './LobbyPage.css'
import {faCheckCircle, faStar, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {useOverlay} from "../../context/OverlayContext";
import {useLoader} from "../../context/LoaderContext";
import {useParams} from "react-router";
import {useConnection} from "../../context/ConnectionContext";
import {useNavigator} from "../../hooks/useNavigator";

const LobbyPage = () => {
    const [username, setUsername] = useState('')
    const [connectionId, setConnectionId] = useState('')
    const [ready, setReady] = useState(false)
    const [players, setPlayers] = useState([])
    const {showOverlay, closeOverlay} = useOverlay()
    const {loadPage} = useLoader()
    const inputRef = useRef()
    const {id} = useParams()
    const navigator = useNavigator()

    const {connection, connectionState} = useConnection()

    useEffect(() => {
        showOverlay()
    }, [])

    useEffect(() => {
        if (!connection || connectionState !== 'Connected') return

        connection.send('JoinGame', id)

        connection.on('GameJoined', (code, id) => {
            setConnectionId(id)
            console.log('Game is joined. Code: ', code, 'ConnectionId: ', id)
        })

        connection.on('LobbyJoined', (players, me) => {
            setPlayers(players)
        })

        connection.on('PlayerJoined', player => {
            setPlayers(prev => [...prev, player])
        })

        connection.on('PlayerDisconnected', id => {
            setPlayers(prev => prev.filter(player => player.connectionId !== id))
        })

        connection.on('PlayerIsReady', (id, isReady) => {
            setPlayers(prev => {
                return prev.map(player => {

                    if (player.connectionId === id) {
                        player.isReady = isReady
                    }

                    return player
                })
            })
        })

        connection.on('GameStarted', () => {
            console.log('game is started!')

            navigator.navigate(`/game/${id}`)
        })

    }, [connection, connectionState])


    const toggleReady = () => {
        connection.send('SetIsReady', !ready).then(() => {
            setReady(prev => !prev)

            if (players.filter(player => !player.isReady).length === 1 && ready === false) {
                connection.send('StartGame')
            }
        })
    }

    if (!username) {
        return <Overlay duration={0}>
            <div className="join">
                <div className="join__content">
                    <p className="text">Enter Your Name:</p>
                    <form className="join__form">
                        <input type="text" className="nickname-input" maxLength={22} ref={inputRef}/>
                        <div className="join__btn" onClick={() => {
                            if (inputRef.current) {
                                loadPage().then(() => {
                                    const username = inputRef.current.value
                                    if (!username) return

                                    connection.send('SetUsername', username).then(() => {
                                        setUsername(username)
                                        closeOverlay()
                                    })
                                })
                            }
                        }}>Join
                        </div>
                    </form>
                </div>
            </div>
        </Overlay>
    }

    return (
        <div className="container">
            <div className="gameinfo">
            <span className="gameinfo__title text">
                Rock Paper Scissors
            </span>
                <div className="gameinfo__additional">
                    Username: {username}
                </div>

                <div className="gameinfo__additional">
                    Game Code: {id}
                </div>

                <div className={`gameinfo__ready ${ready ? 'ready' : 'not-ready'}`}
                     onClick={toggleReady}
                >
                    {ready ? 'Ready' : 'Not Ready'}
                </div>

                <div className="gameinfo__players">
                    {players.map(player => {

                        if (player.connectionId === connectionId) {
                            return (
                                <div className="gameinfo__player" key={player.connectionId}>
                                    <div className="gameinfo__icon">
                                        <FontAwesomeIcon icon={faStar} style={{padding: '0 10px 0 0'}}/>
                                    </div>
                                    <div className="gameinfo__nickname">
                                        {player.name}
                                    </div>
                                    <div className="gameinfo__readyness">
                                        {ready ?
                                            <FontAwesomeIcon icon={faCheckCircle}/>
                                            :
                                            <FontAwesomeIcon icon={faTimesCircle}/>
                                        }
                                    </div>
                                </div>
                            )
                        }

                        return <div className="gameinfo__player" key={player.connectionId}>
                            <div className="gameinfo__nickname">
                                {player.name}
                            </div>
                            <div className="gameinfo__readyness">
                                {player.isReady ?
                                    <FontAwesomeIcon icon={faCheckCircle}/>
                                    :
                                    <FontAwesomeIcon icon={faTimesCircle}/>
                                }
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    );
};

export default LobbyPage;
