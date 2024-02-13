import {JSX} from 'react'

function Footer(): JSX.Element {
    return (
        <footer className="text-zinc-500 flex flex-wrap justify-center gap-x-6 py-7 w-full">
            <div className="cursor-pointer hover:text-zinc-400 transition">About</div>
            <div className="cursor-pointer hover:text-zinc-400 transition">Download the X app</div>
            <div className="cursor-pointer hover:text-zinc-400 transition">Terms of Service</div>
            <div className="cursor-pointer hover:text-zinc-400 transition">Privacy Policy</div>
            <div className="cursor-pointer hover:text-zinc-400 transition">Cookie Policy</div>
            <div className="cursor-pointer hover:text-zinc-400 transition">Accessibility</div>
        </footer>
    )
}

export default Footer
