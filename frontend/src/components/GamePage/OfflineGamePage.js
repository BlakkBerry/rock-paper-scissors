import React, {useState} from 'react';
import {useLoader} from "../../context/LoaderContext";
import './GamePage.css'
import Overlay from "../Overlay/Overlay";
import {useOverlay} from "../../context/OverlayContext";
import Choice from "./Choice";
import Toolbar from "./Toolbar";

const choices = {
    rock: 1,
    paper: 2,
    scissors: 3
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

const OfflineGamePage = () => {

    const [choice, setChoice] = useState()
    const [botChoice, setBotChoice] = useState()
    const {loadPage} = useLoader()
    const {showOverlay, closeOverlay} = useOverlay()

    const vote = (choice) => {
        loadPage().then(() => {
            setChoice(choice)
            setBotChoice(Math.floor(Math.random() * 3 + 1)) // random number from 1 - 3
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
                        <Choice choice={choice}/>
                        <Choice choice={botChoice} color={'red'}/>
                    </div>
                    <Overlay onClick={() => reload()}>
                        <Toolbar />
                        <h1 className="overlay__title">{getResults(choice, botChoice)}</h1>
                        <p className="overlay__hint">Press to continue...</p>
                    </Overlay>
                </>
            }
        </div>
    )
};

export default OfflineGamePage;
