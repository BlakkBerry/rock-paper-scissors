import {useHistory} from "react-router-dom";
import {useLoader} from "../context/LoaderContext";

export const useNavigator = () => {
    const history = useHistory()
    const {loadPage} = useLoader()

    return {
        navigate: path => {
            return new Promise(resolve => {
                loadPage().then(() => {
                    history.push(path)

                    resolve()
                })
            })
        }
    }
}
