import {FormEvent, FunctionComponent, useState} from "react"
import {useNavigate} from "react-router-dom"
import { useLoginMutation } from 'redux/kimai'
import {useLocalStorage} from "lib/useLocalStorage"
import {DropdownText} from "lib/forms/DropdownText"
import {TextInput} from "lib/forms/TextInput"
import {Button} from "lib/forms/Button/Button"

import { useDispatch } from 'react-redux'
import {setCredentials} from "components/login/loginSlice"

export const Login: FunctionComponent = () => {
    const dispatch = useDispatch()
    const [login] = useLoginMutation()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [environments, setEnvironment] = useLocalStorage<string[]>('environments', [])
    const [url, setUrl] = useState('')
    const [hasError, setError] = useState(false)

    const addEnvironment = () => setEnvironment(e => [...e, url])
    const removeEnvironment = () => setEnvironment(e => e.filter(v => v !== url))

    const navigate = useNavigate()

    const submit = async (e: FormEvent) => {
        e.preventDefault()
        try{
            await login({url, username, password}).unwrap()
            dispatch(setCredentials({username,password,url}))
            navigate('/')
        }catch(err){
            setError(true)
        }
    }

    return <>
        <div className="flex flex-col h-full justify-center items-center">
            <div className="border border-zinc-400 p-7 rounded-lg">
                <form onSubmit={submit}>
                    <div className="flex">
                        <div className="mr-3">
                            <div className="mb-5"><DropdownText options={environments} value={url}
                                                                onChange={e => setUrl(e)} label="Umgebung:"/></div>
                            <div className="mb-5"><TextInput value={username} autoComplete="username"
                                                             label="Benutzername:" onChange={e => setUsername(e)}/>
                            </div>
                            <div className="mb-5"><TextInput value={password} password autoComplete="password"
                                                             label="Password:" onChange={e => setPassword(e)}/></div>
                        </div>
                        <div>
                            <Button onClick={addEnvironment}>+</Button>
                            <Button onClick={removeEnvironment}>-</Button>
                        </div>
                    </div>
                    <Button submit>Login</Button>
                    {hasError && <span className="text-red-600 ml-3">Fehler beim Login</span>}
                </form>
            </div>
        </div>

    </>
}