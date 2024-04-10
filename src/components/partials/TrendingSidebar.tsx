import {HiMiniMagnifyingGlass, HiMiniXMark} from "react-icons/hi2";
import TrendingTag from "../layouts/TrendingTag.tsx";
import FollowUser from "../layouts/FollowUser.tsx";
import {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import useDebounce from "../hooks/UseDebounce.tsx";
import ApiClient from "../services/ApiClient.tsx";
import SearchResult from "../layouts/SearchResult.tsx";
import {UserInfo} from "../../Interfaces.tsx";

function TrendingSidebar() {

    const {
        suggestedUsersToFollow,
        hashtags,
        setHashtags,
        hashtagsPageURL,
        setHashtagsPageURL,
    } = useContext(AppContext)
    const [isOpen, setIsOpen] = useState(false)
    const [searchResults, setSearchResults] = useState<UserInfo[]>([])
    const [pageURL, setPageURL] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const debounceValue = useDebounce(searchValue)

    const sendRequest = () => {
        ApiClient().get(`/search-user/${debounceValue}`)
            .then(res => {
                setSearchResults(res.data.data.users)
                const nextPageUrl = res.data.data.pagination.next_page_url
                nextPageUrl ? setPageURL(nextPageUrl) : null
            })
            .catch(err => {
                console.log(err)
            })
    }
    const getSearchResult = (pageURL: string) => {
        ApiClient().get(pageURL)
            .then(res => {
                setSearchResults(prevSearchedResults => [
                    ...prevSearchedResults,
                    ...res.data.data.users
                ])
                const nextPageUrl = res.data.data.pagination.next_page_url
                setPageURL(nextPageUrl ? nextPageUrl : '')
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleOpen = () => {
        setIsOpen(true)
    }

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }

    useEffect(() => {
        if (debounceValue !== '') {
            sendRequest();
        } else {
            setSearchResults([])
        }
    }, [debounceValue]);

    const searchRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            searchRef.current && !searchRef.current.contains(e.target as Node) ? setIsOpen(false) : ''
        }

        document.addEventListener('mousedown', handleClick)

        return () => {
            document.removeEventListener('mousedown', handleClick)
        }
    }, []);

    // Detect when scroll to last element
    const lastResultRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                getSearchResult(pageURL)
            }
        }, {
            threshold: 0.5 // Trigger when 50% of the last tweet is visible
        });

        // Watch the last tweet
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

    const users = searchResults.slice(0, searchResults.length - 1).map(user => {
        return(
            <SearchResult {...user} setIsOpen={setIsOpen} isOpen={isOpen}/>
        )
    })

    const popupMenu = useRef<HTMLDivElement>(null)

    const trendingHashtags = hashtags.map(hashtag => {
        return (
            <TrendingTag key={hashtag.id} id={hashtag.id} hashtag={hashtag.hashtag} count={hashtag.count}/>
        )
    })


    return (
        <div className={`z-[300] text-neutral-100 flex-col gap-y-8 h-dvh max-w-[25rem] 2xl:min-w-[23rem] xl:min-w-[21rem] lg:min-w-[21rem] hidden lg:flex justify-self-end fixed`}>
            <div ref={searchRef} className={`mt-2 relative`}>
                <input
                    onClick={handleOpen}
                    onChange={handleSearchChange}
                    value={searchValue}
                    type="text"
                    placeholder={`Search`}
                    className={`${isOpen ? 'bg-transparent ring-2 ring-sky-500' : ''} bg-[#2a2d32b3] relative z-20 w-full px-12 py-3 rounded-full font-light focus:outline-0 placeholder:text-[#71767b] ${isOpen ? 'placeholder:text-sky-500' : ''}`}
                />
                <HiMiniMagnifyingGlass className={`absolute top-1/2 left-3 -translate-y-1/2 size-5 z-10 ${isOpen ? 'text-sky-500' : 'text-white'}`}/>
                {(isOpen && searchValue !== '') &&
                    <div className={`absolute bg-sky-500 hover:bg-sky-600 transition top-1/2 right-5 -translate-y-1/2 z-30 text-black rounded-full p-[2px] cursor-pointer`}>
                        <HiMiniXMark
                            onClick={() => setSearchValue('')}
                            className={`size-5`}/>
                    </div>
                }

            {/*  Search result  */}
                {isOpen && <div
                    className={`bg-black absolute w-full rounded-lg shadow-[0px_0px_7px_-2px_white] max-h-[40rem] overflow-y-scroll mt-2 z-[100] flex flex-col gap-y-2`}>
                    {users}
                    <div ref={lastResultRef}>
                        {searchResults.length > 0 && (
                            <SearchResult {...searchResults[searchResults.length - 1]} isOpen={isOpen} setIsOpen={setIsOpen}/>
                        )}
                    </div>
                </div>}

            </div>

            <div className={`bg-[#2a2d32b3] rounded-2xl`}>
                <h1 className={`font-bold text-2xl p-4`}>What's happening</h1>

                <div ref={popupMenu} className={`mt-6 flex flex-col gap-y-2 pb-3`}>{trendingHashtags}</div>

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
