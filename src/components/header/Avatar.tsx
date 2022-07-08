import React from "react";
import {useUserQuery} from "../../redux/clockify";

export const Avatar = ()=>{
    const { data} = useUserQuery()
    return <img className="w-10 rounded-full" src={data?.profilePicture} alt="avatar"/>
}