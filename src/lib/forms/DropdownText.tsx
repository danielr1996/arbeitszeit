import {TextInput} from "lib/forms/TextInput"

type Props = {
    label?: string,
    value?: string,
    onChange?: (e: string) => void,
    options?: any[],
}
export const DropdownText = ({label, value, onChange, options}: Props)=>{
    return <>
        <TextInput
            label={label}
            value={value}
            list="options"
            onChange={e=> onChange ? onChange(e) : ()=>{}}
        />
        <datalist id="options">
            {options && options.map(e => (
                <option key={e} value={e}/>
            ))}
        </datalist>
    </>
}