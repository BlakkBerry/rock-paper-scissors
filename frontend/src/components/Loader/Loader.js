import React, {useMemo} from 'react';
import './Loader.css'
import {useLoader} from "../../context/LoaderContext";

const Loader = ({duration = 1.5}) => {

    const {isLoading, setDuration} = useLoader()

    useMemo(() => {
        setDuration(duration)
    }, [duration, setDuration])

    if (!isLoading) return null

    return <div id="loader" style={{animationDuration: `${duration}s`}}/>
};

export default Loader;
