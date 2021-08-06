import React from 'react';
import {useNavigator} from "../hooks/useNavigator";

const Navigation = ({children, to}) => {

    const navigator = useNavigator()

    return (
        <div onClick={() => navigator.navigate(to)}>
            {children}
        </div>
    );
};

export default Navigation;
