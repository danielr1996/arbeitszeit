
type Props = {
    label?: string,
    value?: string,
    onChange?: (e: string) => void
    autoComplete?: 'username' | 'password'
    password?: boolean,
    list?: string,
}
export const TextInput = ({label, value, onChange, autoComplete, password, list}: Props)=>{

    return <>
        <label className="flex justify-between gap-5 py-1">
            <span className="" >{label}</span>
            <input
                className="bg-transparent border border-zinc-400 border-solid rounded-sm"
                value={value}
                type={password ? 'password' : 'text'}
                autoComplete={autoComplete}
                list={list}
                onChange={e=> onChange ? onChange(e.target.value) : ()=>{}}/>
        </label>
    </>
}