import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {Link} from "react-router-dom";
import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import ApiClient from "../ApiClient.tsx";
import {Hashtag} from "../../Interfaces.tsx";
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
                    className={`${isHashtagMenuOpen ? 'animate-fade-in' : ''} tweet-drop-down-clip-path bg-[#0a0c0e] flex flex-col gap-y-3 justify-self-end py-4 px-4 pr-8 rounded-lg absolute w-[19rem] xxs:w-[21rem] -bottom-4 right-14`}>
                    <button
                        onClick={removeHashtag}
                        className={`flex items-center gap-x-3 bg-[#111315] py-3 px-6 text-left rounded-lg hover:bg-[#1a1d20] transition cursor-pointer`}>
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

            {!disableLink &&
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
