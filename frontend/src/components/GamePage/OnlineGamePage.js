import React, {useEffect, useRef, useState} from 'react';
import './GamePage.css'
import './OnlineGamePage.css'
import {useConnection} from "../../context/ConnectionContext";
import {useLoader} from "../../context/LoaderContext";
import {useNavigator} from "../../hooks/useNavigator";
import {useOverlay} from "../../context/OverlayContext";
import Overlay from "../Overlay/Overlay";
import Choice from "./Choice";

const choices = {
    none: '0',
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
    results: 'RESULTS',
    restarting: 'RESTARTING'
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
    const connectionId = useRef()
    const getConnectionId = () => connectionId.current

    const {loadPage} = useLoader()
    const {showOverlay, closeOverlay} = useOverlay()
    const navigator = useNavigator()

    const [players, setPlayers] = useState([])
    const [choice, setChoice] = useState(choices.none)
    const [winners, setWinners] = useState([])

    const [gameState, _setGameState] = useState(GameState.voting)
    const [playerState, setPlayerState] = useState(PlayerState.idle)

    useEffect(() => {
        if (!connection || connectionState !== 'Connected') return

        connection.send('GetConnectionId')

        connection.on('ReceiveConnectionId', id => {
            connectionId.current = id
        })

        connection.on('Draw', players => {
            setGameState(GameState.results)

            setPlayerState(PlayerState.draw)

            setPlayers(players)
            closeOverlay()

            console.log('Draw', 'Players: ', players)
        })

        connection.on('RoundFinished', (players, winnersIds) => {
            setGameState(GameState.results)

            if (winnersIds.includes(getConnectionId())) setPlayerState(PlayerState.passed)
            else setPlayerState(PlayerState.looser)

            setPlayers(players)
            setWinners(winnersIds)
            closeOverlay()

            console.log('Not Draw', 'Players: ', players, 'Winners: ', winnersIds)
        })

        connection.on('GameFinished', (players, winnerId) => {
            setGameState(GameState.results)

            if (winnerId === getConnectionId()) setPlayerState(PlayerState.winner)
            else setPlayerState(PlayerState.looser)

            setPlayers(players)
            setWinners([winnerId])
            closeOverlay()

            console.log('Not Draw', 'Players: ', players, 'Winner: ', winnerId)
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
            case GameState.results:
                closeOverlay()
                loadPage().then(() => {
                    setTimeout(() => {
                        showOverlay()
                    }, 1500)
                })
                break
            case GameState.restarting:
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
    }

    return <div className="container centered">
        <div className="choices">
            {players.map(player => {
                if (playerState === PlayerState.draw) {
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
            {playerState === PlayerState.winner && <>
                <h1 className="overlay__title">YOU WON!</h1>
                <p className="overlay__hint">Congratulations!</p>
            </>}

            {playerState === PlayerState.passed && <>
                <h1 className="overlay__title">YOU PASSED!</h1>
                <p className="overlay__hint">You will play another match!</p>
            </>}

            {playerState === PlayerState.draw && <>
                <h1 className="overlay__title">DRAW!</h1>
                <p className="overlay__hint">You will play another match!</p>
            </>}

            {playerState === PlayerState.looser && <>
                <h1 className="overlay__title">YOU LOSE!</h1>
                <p className="overlay__hint">You can spectate others!</p>
            </>}
        </Overlay>
    </div>


    return (
        <div className="container centered">
            {!choice ?
                <div className="buttons">
                    <div className="button circle" id="top-circle" onClick={() => vote(choices.rock)}>✊</div>
                    <div className="button circle" id="left-circle" onClick={() => vote(choices.paper)}>✋</div>
                    <div className="button circle" id="right-circle" onClick={() => vote(choices.scissors)}>✌</div>
                </div>
                :
                <>
                    {/*<div className="choices">*/}
                    {/*    <div className="circle choice">{choice}</div>*/}
                    {/*    <div className="circle choice" style={{backgroundColor: 'red'}}>{botChoice}</div>*/}
                    {/*</div>*/}
                    {/*<Overlay onClick={() => {*/}
                    {/*}}>*/}
                    {/*    <div className="toolbar">*/}
                    {/*        <div className="toolbar__item circle" onClick={() => navigator.navigate('/')}>*/}
                    {/*            <FontAwesomeIcon icon={faDoorOpen}/>*/}
                    {/*        </div>*/}
                    {/*        <div className="toolbar__item circle" onClick={() => navigator.navigate('/')}>*/}
                    {/*            <FontAwesomeIcon icon={faPlus}/>*/}
                    {/*        </div>*/}
                    {/*        <div className="toolbar__item circle" onClick={() => navigator.navigate('/')}>*/}
                    {/*            <FontAwesomeIcon icon={faSignInAlt}/>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <h1 className="overlay__title">YOU WON!</h1>*/}
                    {/*    <p className="overlay__continue">Press to continue...</p>*/}
                    {/*</Overlay>*/}
                </>
            }
        </div>
    )
};

export default OnlineGamePage;
