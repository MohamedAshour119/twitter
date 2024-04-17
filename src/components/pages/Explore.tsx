import {LuArrowBigUp} from "react-icons/lu";
import Sidebar from "../partials/Sidebar.tsx";
import TrendingSidebar from "../partials/TrendingSidebar.tsx";
import TweetModel from "../layouts/TweetModel.tsx";
import {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import useDebounce from "../hooks/UseDebounce.tsx";
import ApiClient from "../services/ApiClient.tsx";
import {UserInfo} from "../../Interfaces.tsx";
import {HiMiniMagnifyingGlass, HiMiniXMark} from "react-icons/hi2";
import SearchResult from "../layouts/SearchResult.tsx";
import {TweetContext} from "../appContext/TweetContext.tsx";
import * as React from "react";
import Tweet from "../layouts/Tweet.tsx";


function Explore() {

    const {
        isModelOpen,
        isCommentOpen,
    } = useContext(AppContext)

    const {
        randomTweets,
        setRandomTweets,
    } = useContext(TweetContext)

    const [isOpen, setIsOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [searchResults, setSearchResults] = useState<UserInfo[]>([])
    const [pageURL, setPageURL] = useState('')
    const debounceValue = useDebounce(searchValue)
    const handleOpen = () => {
        setIsOpen(true)
    }

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }

    const getSearchResult = (keyword: string) => {
        ApiClient().get(`/search-user/${keyword}`)
            .then(res => {
                setSearchResults(() => ([
                    ...res.data.data.users
                ]))
                const nextPageUrl = res.data.data.pagination.next_page_url
                nextPageUrl ? setPageURL(nextPageUrl) : null
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        if (debounceValue !== '') {
            getSearchResult(debounceValue);
        } else {
            setSearchResults([])
        }
    }, [debounceValue]);

    const exploreSearchRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            !exploreSearchRef.current?.contains(e.target as Node) ? setIsOpen(false) : ''
        }
        document.addEventListener('mousedown', handleClick)
        return () => {
            document.removeEventListener('mousedown', handleClick)
        }
    }, []);

    const users = searchResults.slice(0, searchResults.length - 1).map(user => {
        return(
            <SearchResult {...user} setIsOpen={setIsOpen} isOpen={isOpen}/>
        )
    })

    const lastResultRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                getSearchResult(pageURL)
            }
        }, {
            threshold: 0.5 // Trigger when 50% of the last tweet is visible
        });

        // Watch the last result
        if (lastResultRef.current) {
            observer.observe(lastResultRef.current)
        }

        // Cleanup
        return () => {
            if (lastResultRef.current) {
                observer.unobserve(lastResultRef.current);
            }
        };
    }, [pageURL])

    const searchForKeyword = (keyword: string) => {
        ApiClient().get(`/search/${keyword}`)
            .then((res) => {
                setRandomTweets( prevResults => ([
                    ...prevResults,
                    ...res.data.data.tweets
                ]))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        setRandomTweets([])
    }, []);

    const displayResults: React.ReactNode = randomTweets?.slice(0, randomTweets.length - 1).map(tweetInfo => (
        <Tweet
            key={tweetInfo.id}
            {...tweetInfo}
        />
    ));

    return (
        <div className={`${isModelOpen || isCommentOpen ? 'bg-[#1d252d]' : 'bg-black'} w-screen h-svh flex justify-center overflow-x-hidden`}>

            <div className={`container z-[100] 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] fixed lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr]`}>
                <div></div>
                <header className={`px-20 pb-3 pt-3 flex border ${isModelOpen || isCommentOpen ? 'opacity-20 pointer-events-none' : ''} border-zinc-700/70 gap-x-8 pt-1 text-neutral-200 bg-black/50 backdrop-blur-sm`}>
                   <div
                       ref={exploreSearchRef}
                       className={`w-full`}>
                       <input
                           onClick={handleOpen}
                           onChange={handleSearchChange}
                           value={searchValue}
                           type="text"
                           placeholder={`Search`}
                           className={`${isOpen ? 'bg-transparent ring-2 ring-sky-500' : ''} bg-[#2a2d32b3] relative z-20 w-full px-12 py-3 rounded-full font-light focus:outline-0 placeholder:text-[#71767b] ${isOpen ? 'placeholder:text-sky-500' : ''}`}
                       />
                       {
                           isOpen &&
                           <div
                               className={`bg-black absolute w-[77%] rounded-lg shadow-[0px_0px_7px_-2px_white] max-h-[40rem] overflow-y-scroll mt-2 z-[100] flex flex-col gap-y-2`}>
                               {(isOpen && debounceValue) &&
                                   <div
                                       onClick={() => {
                                           setRandomTweets([])
                                           searchForKeyword(debounceValue)
                                           setIsOpen(false)
                                           setSearchValue('')
                                       }}
                                       className={`p-4 ${searchResults.length > 0 ? 'border-b' : ''}  border-zinc-700/70 cursor-pointer hover:bg-[#1c1e2182] transition`}
                                   >
                                       Search for "{debounceValue}"
                                   </div>
                               }
                               {users}
                               <div ref={lastResultRef}>
                                   {searchResults.length > 0 && (
                                       <SearchResult {...searchResults[searchResults.length - 1]} isOpen={isOpen} setIsOpen={setIsOpen}/>
                                   )}
                               </div>
                           </div>
                       }

                       <HiMiniMagnifyingGlass className={`absolute top-1/2 left-24 -translate-y-1/2 size-5 z-10 ${isOpen ? 'text-sky-500' : 'text-white'}`}/>
                       {(isOpen && searchValue !== '') &&
                           <div
                               onClick={() => setSearchValue('')}
                               className={`absolute bg-sky-500 hover:bg-sky-600 transition top-1/2 right-24 -translate-y-1/2 z-30 text-black rounded-full p-[2px] cursor-pointer`}>
                               <HiMiniXMark
                                   className={`size-5`}/>
                           </div>
                       }
                   </div>
                </header>
                <div></div>
            </div>

            <div className={`${isModelOpen || isCommentOpen ? 'opacity-20 pointer-events-none' : ''} container 2xl:px-12 sm:px-4 grid xl:grid-cols-[2fr,3fr,2fr] lg:grid-cols-[0.5fr,3fr,2fr] md:grid-cols-[0.5fr,3fr] sm:grid-cols-[1fr,5fr] grid-cols-1`}>

                {/* Scroll to top button */}
                <div className={`bg-sky-500 z-50 absolute bottom-5 left-2 p-2 rounded-full cursor-pointer block sm:hidden`}>
                    <LuArrowBigUp className={`size-7 text-white/90`}/>
                </div>

                {/* Sidebar */}
                <div className={`justify-end hidden sm:flex relative`}>
                    <Sidebar/>
                </div>
                {/* Middle section */}
                <div className={`text-neutral-200 border-r border-l border-zinc-700/70`}>
                    <div className={`mt-20`}>
                        {displayResults}
                        <div ref={lastResultRef}>
                            {randomTweets.length > 0 && (
                                <Tweet {...randomTweets[randomTweets.length - 1]} />
                            )}
                        </div>
                    </div>
                </div>

                <TrendingSidebar/>
            </div>
            <TweetModel />
        </div>
    )
}

export default Explore
