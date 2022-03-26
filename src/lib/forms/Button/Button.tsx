import React from "react"

export type Props = {
    submit?: boolean
    onClick?: ()=>void
}
export const Button = ({submit, onClick,children}: React.PropsWithChildren<Props>)=>{
    return <button className="bg-gray-400 text-white px-3 py-1" type={submit ? 'submit' : 'button'} onClick={onClick}>{children}</button>
}