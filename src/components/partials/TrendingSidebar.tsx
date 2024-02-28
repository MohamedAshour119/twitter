import {HiMiniMagnifyingGlass} from "react-icons/hi2";
import TrendingTag from "../layouts/TrendingTag.tsx";
import FollowUser from "../layouts/FollowUser.tsx";
import {useContext} from "react";
import {AppContext} from "../appContext/AppContext.tsx";

function TrendingSidebar() {

    const {suggestedUsersToFollow} = useContext(AppContext)

    return (
        <div className={`text-neutral-100 flex-col gap-y-8 h-dvh max-w-[25rem] 2xl:min-w-[23rem] xl:min-w-[21rem] lg:min-w-[21rem] hidden lg:flex justify-self-end fixed animate-slide-left`}>
            <div className={`mt-2 relative`}>
                <input
                    type="text"
                    placeholder={`Search`}
                    className={`bg-[#2a2d32b3] w-full px-12 py-3 rounded-full font-light focus:outline-0 placeholder:text-[#71767b]`}
                />
                <HiMiniMagnifyingGlass className={`absolute top-1/2 left-3 -translate-y-1/2 size-5 text-[#71767b]`}/>
            </div>

            <div className={`bg-[#2a2d32b3] rounded-2xl`}>
                <h1 className={`font-bold text-2xl p-4`}>What's happening</h1>

                <div className={`mt-6 flex flex-col gap-y-5 pb-3`}>
                    <TrendingTag/>
                    <TrendingTag/>
                    <TrendingTag/>
                    <TrendingTag/>
                </div>

            </div>

            <div className={`bg-[#2a2d32b3] rounded-2xl`}>
                <h1 className={`font-bold text-2xl p-4`}>Who to follow</h1>
                <div className={`flex flex-col gap-y-2`}>
                    {suggestedUsersToFollow?.length === 0 &&
                        <div role="status" className="max-w-sm animate-pulse px-4 py-3 flex flex-col gap-y-8">
                            <div className="h-12 bg-zinc-800 rounded-full w-full"></div>
                            <div className="h-12 bg-zinc-800 rounded-full w-full"></div>
                            <div className="h-12 bg-zinc-800 rounded-full w-full"></div>
                        </div>
                    }

                    {suggestedUsersToFollow?.map(user => (
                        <FollowUser key={user.id} suggestedUsersToFollow={user}/>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default TrendingSidebar
