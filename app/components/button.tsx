import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface IProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> { }

export function Button({ ...props }: IProps) {
    return (
        <button className={`w-full bg-[#263D69] text-white py-2 px-4 rounded-md cursor-pointer `.concat(props?.className || "")} {...props} />
    )
}