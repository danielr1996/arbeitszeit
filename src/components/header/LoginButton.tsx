import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {useLoginState} from "../login/loginSlice";

export const LoginButton = ()=>{

    const isLoggedIn = useLoginState()
    return <span><Link to={isLoggedIn ? '/logout' : '/login'}><FontAwesomeIcon icon={faRightFromBracket} /></Link></span>
}