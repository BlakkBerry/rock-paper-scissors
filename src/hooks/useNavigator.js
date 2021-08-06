import {useHistory} from "react-router-dom";
import {useLoader} from "../context/LoaderContext";

export const useNavigator = () => {
    const history = useHistory()
    const {loadPage} = useLoader()

    return {
        navigate: path => {
            return new Promise(resolve => {
                loadPage().then(() => {
                    resolve()

                    setTimeout(() => {
                        history.push(path)
                    })
                })
            })
        },
        navigateAndReload: path => {
            return new Promise(resolve => {
                loadPage().then(() => {
                    resolve()

                    setTimeout(() => {
                        history.push(path)
                        window.location.reload()
                    })
                })
            })
        }
    }
}
