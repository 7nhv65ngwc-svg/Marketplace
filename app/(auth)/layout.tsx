import { ReactNode } from "react";

interface IProps {
    children: ReactNode
}

export default function Layout({ children }: Readonly<IProps>) {
    return (
        <>
            <header className="h-14 bg-[#1c4694] w-full flex items-center px-4">
                <h1 className="text-xl text-white font-semibold">Marketplace</h1>
            </header>
            {children}
        </>
    )
}