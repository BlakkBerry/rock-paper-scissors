import {useEffect} from 'react';
import {useLoader} from "../../context/LoaderContext";

const LoadPage = ({children}) => {

    const {isLoading, loadPage} = useLoader()

    useEffect(() => {
        loadPage()
    }, [])

    if (isLoading) return null

    return children
};

export default LoadPage;
