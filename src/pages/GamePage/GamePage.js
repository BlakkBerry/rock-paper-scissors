import React, {useEffect, useState} from 'react';
import {useLoader} from "../../context/LoaderContext";

const choices = {
    rock: '✊',
    paper: '✋',
    scissors: '✌'
}

const getRandomChoice = () => {
    const keys = Object.keys(choices)
    return choices[keys[Math.floor(keys.length * Math.random())]]
}

const GamePage = () => {

    const [choice, setChoice] = useState()
    const [botChoice, setBotChoice] = useState()
    const {loadPage} = useLoader()

    useEffect(() => {
        loadPage()
    }, [])

    const vote = (choice) => {
        loadPage().then(() => {
            setChoice(choice)
            setBotChoice(getRandomChoice())
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
                <div className="choices">
                    <div className="circle choice">{choice}</div>
                    <div className="circle choice" style={{backgroundColor: 'red'}}>{botChoice}</div>
                </div>
            }
        </div>
    )
};

export default GamePage;
