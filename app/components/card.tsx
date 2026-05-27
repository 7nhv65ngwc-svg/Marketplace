import { ReactNode } from "react";

interface IProps {
    children?: ReactNode
}

export function Card({ children }: IProps){
    return (
        <div className="bg-white border-2 rounded-md p-4 border-none">
            {children}
        </div>
    )
}