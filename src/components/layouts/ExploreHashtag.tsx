import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {Link} from "react-router-dom";
import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import ApiClient from "../services/ApiClient.tsx";
import {Hashtag} from "../../Interfaces.tsx";
import {HiMiniXMark} from "react-icons/hi2";
import {FaRegFaceAngry} from "react-icons/fa6";

interface Props {
    id: number
    hashtag: string
    count: number
    setExplorePageHashtags: Dispatch<SetStateAction<Hashtag[]>>
    explorePageHashtags: Hashtag[]
}

function ExploreHashtag(props: Props) {

    const [disableLink, setDisableLink] = useState(false)
    const [isHashtagMenuOpen, setIsHashtagMenuOpen] = useState(false)

    const popupMenu = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popupMenu.current && !popupMenu.current.contains(e.target as Node)) {
                popupMenu.current.classList.add('animate-fade-out')
                setTimeout(() => {
                    setIsHashtagMenuOpen(false);
                }, 300)
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const closeWithAnimation = () => {
        popupMenu.current?.classList.add('animate-fade-out')
        setTimeout(() => {
            setIsHashtagMenuOpen(false)
        }, 300)
    }

    const removeHashtag = () => {
        closeWithAnimation()

        ApiClient().post(`/uninterested-hashtag/${props.id}`)
            .then(() => {
                const filteredHashtags = props.explorePageHashtags.filter(hashtag => hashtag.id !== props.id)
                props.setExplorePageHashtags(filteredHashtags)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const hashtagWithoutSymbol = props.hashtag.replace('#', '');

    return (
        <div className={`relative`}>
            {isHashtagMenuOpen &&
                <div
                    ref={popupMenu}
                    className={`${isHashtagMenuOpen ? 'animate-fade-in' : ''} bg-black flex flex-col gap-y-3 justify-self-end border border-neutral-700/70 py-4 px-4 rounded-lg absolute w-[19rem] xxs:w-[21rem] -bottom-4 right-14 shadow-[-2px_2px_12px_#4f4e4e]`}>
                    <div
                        onClick={closeWithAnimation}
                        className="absolute -right-4 -top-4 cursor-pointer bg-neutral-950 hover:bg-neutral-900 text-2xl flex justify-center items-center rounded-full h-9 w-9 transition">
                        <HiMiniXMark/>
                    </div>
                    <button
                        onClick={removeHashtag}
                        className={`flex items-center gap-x-3 bg-neutral-950 py-3 px-6 text-left rounded-lg hover:bg-neutral-800 transition cursor-pointer`}>
                        <FaRegFaceAngry className={`size-5`}/>
                        I'm not interested in this!
                    </button>
                </div>
            }

            {disableLink &&
                <div className={`flex items-start mt-6 px-4 py-2 justify-between hover:bg-[#141516] transition`}>
                    <div>
                        <h3 className={`text-[#71767b] text-sm`}>Trending</h3>
                        <div>{props.hashtag}</div>
                        <div className={`text-[#71767b] text-sm`}>{props.count}</div>
                    </div>
                    <div
                        className={`font-light text-[#71767b] text-2xl p-1 cursor-pointer hover:bg-sky-500/20 hover:text-sky-300 rounded-full flex justify-center items-center transition`}
                        onTouchStart={() => setDisableLink(true)}
                        onTouchEnd={() => setDisableLink(true)}
                        onClick={() => setIsHashtagMenuOpen(!isHashtagMenuOpen)}
                        onMouseEnter={() => setDisableLink(true)}
                        onMouseLeave={() => setDisableLink(false)}
                    >

                        <HiOutlineDotsHorizontal/>
                    </div>
                </div>
            }

            {disableLink ||
                <Link to={`/${hashtagWithoutSymbol}`}
                       className={`flex items-start mt-6 px-4 py-2 justify-between hover:bg-[#141516] transition`}>
                    <div>
                        <h3 className={`text-[#71767b] text-sm`}>Trending</h3>
                        <div>{props.hashtag}</div>
                        <div className={`text-[#71767b] text-sm`}>{props.count}</div>
                    </div>
                    <div
                        className={`font-light text-[#71767b] text-2xl p-1 cursor-pointer hover:bg-sky-500/20 hover:text-sky-300 rounded-full flex justify-center items-center transition`}
                        onTouchStart={() => setDisableLink(true)}
                        onTouchEnd={() => setDisableLink(true)}
                        onClick={() => setIsHashtagMenuOpen(!isHashtagMenuOpen)}
                        onMouseEnter={() => setDisableLink(true)}
                        onMouseLeave={() => setDisableLink(false)}
                    >
                        <HiOutlineDotsHorizontal/>
                    </div>
                </Link>
            }
        </div>

    )
}

export default ExploreHashtag
