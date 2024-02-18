import Sidebar from "../partials/Sidebar.tsx";

function UserHomePage() {
    return (
        <div className={`bg-black w-screen h-screen flex justify-center`}>
            <div className={`container grid grid-cols-[1fr,3fr,1fr]`}>
                <Sidebar/>
            </div>
        </div>
    )
}

export default UserHomePage
