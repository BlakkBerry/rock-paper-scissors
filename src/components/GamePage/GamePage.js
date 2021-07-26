import React, {useEffect, useState} from 'react';
import {useLoader} from "../../context/LoaderContext";
import './GamePage.css'
import Overlay from "../Overlay/Overlay";
import {useOverlay} from "../../context/OverlayContext";
import {faDoorOpen, faPlus, faSignInAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useHistory} from "react-router-dom";
import {useNavigator} from "../../hooks/useNavigator";

const choices = {
    rock: '✊',
    paper: '✋',
    scissors: '✌'
}

const getRandomChoice = () => {
    const keys = Object.keys(choices)
    return choices[keys[Math.floor(keys.length * Math.random())]]
}

const getResults = (choice, botChoice) => {
    if (choice === botChoice)
        return 'DRAW'

    if ((choice === choices.rock && botChoice === choices.scissors) ||
        (choice === choices.paper && botChoice === choices.rock) ||
        (choice === choices.scissors && botChoice === choices.paper)
    ) {
        return 'YOU WON!'
    }

    return 'YOU LOSE'
}

const GamePage = () => {

    const [choice, setChoice] = useState()
    const [botChoice, setBotChoice] = useState()
    const {loadPage} = useLoader()
    const {showOverlay, closeOverlay} = useOverlay()
    const navigator = useNavigator()

    const vote = (choice) => {
        loadPage().then(() => {
            setChoice(choice)
            setBotChoice(getRandomChoice())
        })

        setTimeout(() => {
            showOverlay()
        }, 1500)
    }

    const reload = () => {
        loadPage().then(() => {
            closeOverlay()
            setChoice(null)
            setBotChoice(null)
        })
    }

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
                    <div className="choices">
                        <div className="circle choice">{choice}</div>
                        <div className="circle choice" style={{backgroundColor: 'red'}}>{botChoice}</div>
                    </div>
                    <Overlay onClick={() => reload()}>
                        <div className="toolbar">
                            <div className="toolbar__item circle" onClick={() => navigator.navigate('/')}>
                                <FontAwesomeIcon icon={faDoorOpen}/>
                            </div>
                            <div className="toolbar__item circle" onClick={() => navigator.navigate('/')}>
                                <FontAwesomeIcon icon={faPlus}/>
                            </div>
                            <div className="toolbar__item circle" onClick={() => navigator.navigate('/')}>
                                <FontAwesomeIcon icon={faSignInAlt}/>
                            </div>
                        </div>
                        <h1 className="overlay__title">{getResults(choice, botChoice)}</h1>
                        <p className="overlay__continue">Press to continue...</p>
                    </Overlay>
                </>
            }
        </div>
    )
};

export default GamePage;
