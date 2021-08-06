import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignInAlt} from "@fortawesome/free-solid-svg-icons";
import {useNavigator} from "../../hooks/useNavigator";
import {useOverlay} from "../../context/OverlayContext";

const Toolbar = ({toReload = true}) => {

    const navigator = useNavigator()
    const {closeOverlay} = useOverlay()

    return (
        <div className="toolbar">
            {/*<div className="toolbar__item circle" onClick={() => navigator.navigateAndReload('/').then(closeOverlay)}>*/}
            {/*    <FontAwesomeIcon icon={faDoorOpen}/>*/}
            {/*</div>*/}
            {/*<div className="toolbar__item circle" onClick={() => navigator.navigateAndReload('/').then(closeOverlay)}>*/}
            {/*    <FontAwesomeIcon icon={faPlus}/>*/}
            {/*</div>*/}
            <div className="toolbar__item circle" onClick={() => {
                if (toReload) {
                    navigator.navigateAndReload('/').then(() => {
                        closeOverlay()
                    })
                } else {
                    navigator.navigate('/').then(() => {
                        closeOverlay()
                    })
                }
            }}>
                <FontAwesomeIcon icon={faSignInAlt}/>
            </div>
        </div>
    );
};

export default Toolbar;
