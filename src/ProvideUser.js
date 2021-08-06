import Cookies from "universal-cookie/es6";
import Overlay from "./pages/Overlay/Overlay";
import React, {useState} from "react";

const ProvideUser = ({children}) => {
    const cookies = new Cookies()
    let user = cookies.get('User')
    const [input, setInput] = useState('')


    if (user)
        return children(user)

    return <>
        <Overlay>
            <div className="join">
                <div className="join__content">
                    <p className="text">Enter your name:</p>
                    <form className="join__form">
                        <input type="text" className="gamecode"
                               value={input}
                               onChange={e => setInput(e.target.value)}/>
                        <div className="join__btn" onClick={() => {
                            if (input)
                                user = input
                        }}>Go
                        </div>
                    </form>
                </div>
            </div>
        </Overlay>
        {children(user)}
    </>
};

export default ProvideUser;
