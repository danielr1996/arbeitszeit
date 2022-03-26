import React from "react";
import {useUserQuery} from "../../redux/kimai";

export const Avatar = ()=>{
    const { data} = useUserQuery()
    return <img className="w-10 rounded-full" src={data?.avatar} alt="avatar"/>
}