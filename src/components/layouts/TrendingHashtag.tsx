import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {HiMiniXMark} from "react-icons/hi2";
import ApiClient from "../ApiClient.tsx";
import {FaRegFaceAngry} from "react-icons/fa6";
import {Hashtag} from "../../Interfaces.tsx";

interface Props {
    id: number
    hashtag: string
    count: number,
    hashtags: Hashtag[]
    setHashtags: Dispatch<SetStateAction<Hashtag[]>>
}
function TrendingHashtag(props: Props) {

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
            .then(res => {
                props.setHashtags(res.data.data)
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
                    className={`${isHashtagMenuOpen ? 'animate-fade-in' : ''} bg-black flex flex-col gap-y-3 justify-self-end border border-neutral-700/70 py-4 px-4 rounded-lg absolute w-[21rem] bottom-8 right-14 shadow-[-2px_2px_12px_#4f4e4e]`}>
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
                <div className={`flex justify-between ${!disableLink ? 'hover:bg-[#25323f30]' : ''} transition `}>
                    <div className={`px-4 py-2 cursor-pointer`}>
                        <div className={`text-[#71767b]`}>Trending</div>

                        <div className={`flex flex-col`}>
                            <span>{props.hashtag}</span>
                            <span className={`text-[#71767b]`}>{props.count} posts</span>
                        </div>
                    </div>

                    <div
                        onTouchStart={() => setDisableLink(true)}
                        onTouchEnd={() => setDisableLink(true)}
                        onClick={() => setIsHashtagMenuOpen(!isHashtagMenuOpen)}
                        onMouseEnter={() => setDisableLink(true)}
                        onMouseLeave={() => setDisableLink(false)}
                        className={`mx-6 mt-2 p-2 rounded-full hover:bg-sky-500/10 cursor-pointer transition h-fit group`}
                    >
                        <HiOutlineDotsHorizontal className={`group-hover:text-sky-500 size-5`}/>
                    </div>

                </div>
            }
            {disableLink ||
                <Link to={`/${hashtagWithoutSymbol}`} className={`flex justify-between ${!disableLink ? 'hover:bg-[#25323f30]' : ''}  transition `}>
                    <div className={`px-4 py-2 cursor-pointer`}>
                        <div className={`text-[#71767b]`}>Trending</div>

                        <div className={`flex flex-col`}>
                            <span>{props.hashtag}</span>
                            <span className={`text-[#71767b]`}>{props.count} posts</span>
                        </div>
                    </div>

                    <div
                        onTouchStart={() => setDisableLink(true)}
                        onTouchEnd={() => setDisableLink(true)}
                        onClick={() => setIsHashtagMenuOpen(!isHashtagMenuOpen)}
                        onMouseEnter={() => setDisableLink(true)}
                        onMouseLeave={() => setDisableLink(false)}
                        className={`mx-6 mt-2 p-2 rounded-full hover:bg-sky-500/10 cursor-pointer transition h-fit group`}
                    >
                        <HiOutlineDotsHorizontal className={`group-hover:text-sky-500 size-5`}/>
                    </div>

                </Link>
            }
        </div>


    )
}

export default TrendingHashtag
