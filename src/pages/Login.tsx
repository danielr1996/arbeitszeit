import {FormEvent, FunctionComponent, useState} from "react";
import {useNavigate} from "react-router-dom";
import { useLoginMutation } from '../services/kimai'
import {useLocalStorage} from "../lib/useLocalStorage";
import {DropdownText} from "../components/forms/DropdownText";
import {TextInput} from "../components/forms/TextInput";
import {Button} from "../components/forms/Button/Button";

export const Login: FunctionComponent = () => {
    const [login, {isLoading}] = useLoginMutation()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [environments, setEnvironment] = useLocalStorage<string[]>('environments', [])
    const [baseUrl, setBaseUrl] = useState(environments[0] || '')
    const [hasError, setError] = useState(false)

    const addEnvironment = () => setEnvironment(e => [...e, baseUrl])
    const removeEnvironment = () => setEnvironment(e => e.filter(v => v !== baseUrl))

    const navigate = useNavigate()

    const submit = async (e: FormEvent) => {
        e.preventDefault()
        const response = await login({username, password})
        console.log(response)
    }

    return <>
        <div className="flex flex-col h-full justify-center items-center">
            <div className="border border-zinc-400 p-7 rounded-lg">
                <form onSubmit={submit}>
                    <div className="flex">
                        <div className="mr-3">
                            <div className="mb-5"><DropdownText options={environments} value={baseUrl}
                                                                onChange={e => setBaseUrl(e)} label="Umgebung:"/></div>
                            <div className="mb-5"><TextInput value={username} autoComplete="username"
                                                             label="Benutzernamen:" onChange={e => setUsername(e)}/>
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