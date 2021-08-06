import React, {useEffect, useRef, useState} from 'react';
import './GamePage.css'
import './OnlineGamePage.css'
import {useConnection} from "../../context/ConnectionContext";
import {useLoader} from "../../context/LoaderContext";
import {useOverlay} from "../../context/OverlayContext";
import Overlay from "../Overlay/Overlay";
import Choice from "./Choice";
import Toolbar from "./Toolbar";
import {useNavigator} from "../../hooks/useNavigator";
import {useParams} from "react-router";

const choices = {
    none: 0,
    rock: 1,
    paper: 2,
    scissors: 3
}

const choicesMappings = {
    1: '✊',
    2: '✋',
    3: '✌'
}

const GameState = {
    voting: 'VOTING',
    waiting: 'WAITING',
    restarting: 'RESTARTING',
    end: 'END'
}

const PlayerState = {
    idle: 'IDLE',
    draw: 'DRAW',
    winner: 'WINNER',
    passed: 'PASSED',
    looser: 'LOOSER'
}

const OnlineGamePage = () => {

    const {connection, connectionState} = useConnection()
    const navigator = useNavigator()
    const connectionId = useRef()
    const getConnectionId = () => connectionId.current
    const {id} = useParams()

    const {loadPage} = useLoader()
    const {showOverlay, closeOverlay} = useOverlay()

    const [players, setPlayers] = useState([])
    const [choice, setChoice] = useState(choices.none)
    const [winners, setWinners] = useState([])

    const [gameState, _setGameState] = useState(GameState.voting)
    const playerState = useRef(PlayerState.idle)

    const isPlayerState = (state) => playerState.current === state
    const setPlayerState = (state) => playerState.current = state

    useEffect(() => {
        if (!connection || connectionState !== 'Connected') return

        connection.send('IsAllowedToJoinGame', id)

        connection.on('CanJoinGame', canJoin => {
            if (!canJoin) navigator.navigateAndReload('/')
        })

        connectionId.current = connection.connection.connectionId

        connection.on('Draw', players => {
            setPlayerState(PlayerState.draw)

            setPlayers(players)

            setGameState(GameState.restarting)
            console.log('Draw', 'Players: ', players)
        })

        connection.on('RoundFinished', (players, winnersIds) => {
            if (winnersIds.includes(getConnectionId())) setPlayerState(PlayerState.passed)
            else setPlayerState(PlayerState.looser)

            setPlayers(players)
            setWinners(winnersIds)

            setGameState(GameState.restarting)
            console.log('Not Draw', 'Players: ', players, 'Winners: ', winnersIds)
        })

        connection.on('GameFinished', (players, winnerId) => {
            if (winnerId === getConnectionId()) setPlayerState(PlayerState.winner)
            else setPlayerState(PlayerState.looser)

            setPlayers(players)
            setWinners([winnerId])

            setGameState(GameState.end)
            console.log('Not Draw', 'Players: ', players, 'Winner: ', winnerId)
        })

        connection.on('PlayersDisconnected', () => {
            navigator.navigateAndReload('/')
        })

    }, [connection, connectionState])


    const setGameState = state => {
        _setGameState(state)

        switch (state) {
            case GameState.voting:
                closeOverlay()
                break
            case GameState.waiting:
                showOverlay()
                break
            case GameState.restarting:
                closeOverlay()

                loadPage().then(() => {
                    setTimeout(() => {
                        showOverlay()
                    }, 1500)
                })


                if (!isPlayerState(PlayerState.looser)) {
                    setTimeout(() => {
                        loadPage().then(() => {
                            closeOverlay()
                            setGameState(GameState.voting)
                        })
                    }, 5000)
                }
                break
            case GameState.end:
                closeOverlay()
                loadPage().then(() => {
                    setTimeout(() => {
                        showOverlay()
                    }, 1500)
                })
                break
            default:
                return;
        }
    }

    const vote = (choice) => {
        loadPage().then(() => {
            connection.send('Vote', choice).then(() => {
                setChoice(choice)
                setGameState(GameState.waiting)
            })
        })
    }

    if (gameState === GameState.voting || gameState === GameState.waiting) {

        return <div className="container centered">
            <div className="buttons">
                <div className="button circle" id="top-circle" onClick={() => vote(choices.rock)}>✊</div>
                <div className="button circle" id="left-circle" onClick={() => vote(choices.paper)}>✋</div>
                <div className="button circle" id="right-circle" onClick={() => vote(choices.scissors)}>✌</div>
            </div>

            <Overlay>
                <div className="online-choice circle">{choicesMappings[choice]}</div>
                <p className="overlay__hint">Wait for others to vote...</p>
            </Overlay>
        </div>
        // } else {
        //     return <div className="container centered">
        //         <div className="choices">
        //             {players.map(player => {
        //                 return <Choice key={player.connectionId} color='purple' choice={choices.none}/>
        //             })}
        //         </div>
        //     </div>
        // }
    }

    if (gameState === GameState.end || gameState === GameState.restarting) {
        return <div className="container centered">
            <div className="choices">
                {players.map(player => {
                    if (isPlayerState(PlayerState.draw)) {
                        return <Choice key={player.connectionId}
                                       choice={player.choice}
                                       nickname={player.name}/>
                    }

                    return <Choice key={player.connectionId}
                                   choice={player.choice}
                                   color={winners.includes(player.connectionId) ? 'green' : 'red'}
                                   nickname={player.name}/>
                })}
            </div>
            <Overlay>
                <Toolbar/>
                {isPlayerState(PlayerState.winner) && <>
                    <h1 className="overlay__title">YOU WON!</h1>
                    <p className="overlay__hint">Congratulations!</p>
                </>}

                {isPlayerState(PlayerState.passed) && <>
                    <h1 className="overlay__title">YOU PASSED!</h1>
                    <p className="overlay__hint">You will play another match!</p>
                </>}

                {isPlayerState(PlayerState.draw) && <>
                    <h1 className="overlay__title">DRAW!</h1>
                    <p className="overlay__hint">You will play another match!</p>
                </>}

                {isPlayerState(PlayerState.looser) && <>
                    <h1 className="overlay__title">YOU LOSE!</h1>
                    <p className="overlay__hint">Good luck next time!</p>
                </>}
            </Overlay>
        </div>
    }
};

export default OnlineGamePage;
