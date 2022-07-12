import {FormEvent, FunctionComponent, useState} from "react"
import {useNavigate} from "react-router-dom"
import {useLoginMutation} from 'redux/clockify'
import {DropdownText} from "lib/forms/DropdownText"
import {TextInput} from "lib/forms/TextInput"
import {Button} from "lib/forms/Button/Button"

import {useDispatch} from 'react-redux'
import {setCredentials} from "components/login/loginSlice"

export const Login: FunctionComponent = () => {
    const dispatch = useDispatch()
    const [login] = useLoginMutation()
    const [token, setToken] = useState('')
    const [workspaceId, setWorkspaceId] = useState('')
    const [userId, setUserId] = useState('')
    const [hasError, setError] = useState(false)

    const navigate = useNavigate()

    const submit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            await login({token, workspaceId, userId}).unwrap()
            dispatch(setCredentials({token, userId, workspaceId}))
            navigate('/')
        } catch (err) {
            setError(true)
        }
    }

    return <>
        <div className="flex flex-col h-full justify-center items-center">
            <div className="border border-zinc-400 p-7 rounded-lg">
                <form onSubmit={submit}>
                    <div className="flex flex-col">
                        <div className="mr-3">
                            <div className="mb-5">
                                <TextInput value={token}
                                           password
                                           autoComplete="password"
                                           label="Token:"
                                           onChange={e => setToken(e)}/>
                            </div>
                        </div>
                        <div className="mr-3">
                            <div className="mb-5">
                                <TextInput value={workspaceId}
                                           label="WorkspaceID:"
                                           onChange={e => setWorkspaceId(e)}/>
                            </div>
                        </div>
                        <div className="mr-3">
                            <div className="mb-5">
                                <TextInput value={userId}
                                           label="UserID:"
                                           onChange={e => setUserId(e)}/>
                            </div>
                        </div>
                    </div>
                    <Button submit>Login</Button>
                    {hasError && <span className="text-red-600 ml-3">Fehler beim Login</span>}
                </form>
            </div>
        </div>

    </>
}
