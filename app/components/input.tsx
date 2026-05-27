import { DetailedHTMLProps, InputHTMLAttributes } from "react"

interface IProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    label?: string
}

export function Input({ label, ...props }: IProps) {
    return (
        <div className="flex flex-col gap-px">
            {label && <label htmlFor={props?.id} className="text-sm select-none font-semibold text-gray-800">{label}</label>}
            <input className={`outline-none `.concat(props?.className || "")} {...props}/>
        </div>
    )
}