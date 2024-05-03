import {HiMiniMagnifyingGlass, HiMiniXMark} from "react-icons/hi2";
import TrendingHashtag from "../layouts/TrendingHashtag.tsx";
import FollowUser from "../layouts/FollowUser.tsx";
import {ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import useDebounce from "../hooks/UseDebounce.tsx";
import ApiClient from "../services/ApiClient.tsx";
import SearchResult from "../layouts/SearchResult.tsx";
import {Hashtag, UserInfo} from "../../Interfaces.tsx";
import {TweetContext} from "../appContext/TweetContext.tsx";
import * as React from "react";
import {useNavigate} from "react-router-dom";

interface Props {
    setPageUrl?: Dispatch<SetStateAction<string>>
    setDisplayNotFoundMsg?: Dispatch<SetStateAction<boolean>>
}

function TrendingSidebar(props: Props) {

    const {
        user,
        location,
        setDisplayNotResultsFound,
    } = useContext(AppContext)

    const {
        setRandomTweets,
    } = useContext(TweetContext)

    const [isOpen, setIsOpen] = useState(false)
    const [searchResults, setSearchResults] = useState<UserInfo[]>([])
    const [suggestedUsersToFollow, setSuggestedUsersToFollow] = useState<UserInfo[]>([])
    const [hashtags, setHashtags] = useState<Hashtag[]>([])
    const [pageURL, setPageURL] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const debounceValue = useDebounce(searchValue)

    const sendRequest = () => {
        ApiClient().get(`/search-user/${debounceValue}`)
            .then(res => {
                setSearchResults(res.data.data.users)
                const nextPageUrl = res.data.data.pagination.next_page_url
                nextPageUrl ? setPageURL(nextPageUrl) : null
                setIsOpen(true)
            })
            .catch(err => {
                console.log(err)
            })
    }

    // Suggested users to follow
    useEffect( () => {
        if(user?.id) {
            ApiClient().get('/home')
                .then(res => {
                    setSuggestedUsersToFollow(res.data.data.suggested_users)
                })
                .catch(err => {
                    console.log(err)
                })
        }

    }, [user])

    const getHashtags = () => {
        ApiClient().get(`/hashtags`)
            .then(res => {
                setHashtags(res.data.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        if(hashtags?.length <= 1) {
            getHashtags()
        }
    }, [hashtags?.length]);
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

    // Handle click outside
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
    }, [lastResultRef])

    const users = searchResults.slice(0, searchResults.length - 1).map(user => {
        return(
            <SearchResult {...user} setIsOpen={setIsOpen} isOpen={isOpen}/>
        )
    })

    const popupMenu = useRef<HTMLDivElement>(null)

    const trendingHashtags = hashtags?.map(hashtag => {
        return (
            <TrendingHashtag key={hashtag.id} id={Number(hashtag.id)} hashtag={hashtag.hashtag} count={hashtag.count}/>
        )
    })

    const navigate = useNavigate()

    const searchForKeyword = (keyword: string) => {
        setDisplayNotResultsFound(false)
        location?.pathname !== '/explore' ? navigate('/explore') : ''
        ApiClient().get(`/search/${keyword}`)
            .then((res) => {
                props.setPageUrl && props.setPageUrl(res.data.data.pagination)
                setRandomTweets( prevResults => ([
                    ...prevResults,
                    ...res.data.data.tweets
                ]))
                setIsOpen(false)
                if(res.data.data.tweets.length === 0) {
                    setDisplayNotResultsFound(true)
                    props.setDisplayNotFoundMsg && props.setDisplayNotFoundMsg(false)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const inputRef = useRef<HTMLInputElement>(null)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        props.setPageUrl && props.setPageUrl('')
        setRandomTweets([])
        searchForKeyword(searchValue)
        setIsOpen(false)
        setSearchValue('')
        inputRef.current?.blur() // To disable auto focus after 'handleSubmit' called
    }

    return (
        <div className={`z-[300] text-neutral-100 flex-col gap-y-8 h-dvh max-w-[25rem] 2xl:min-w-[23rem] xl:min-w-[21rem] lg:min-w-[21rem] hidden lg:flex justify-self-end fixed`}>
            <div ref={searchRef} className={`mt-2 relative`}>
                <form onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        onClick={handleOpen}
                        onChange={handleSearchChange}
                        value={searchValue}
                        type="text"
                        placeholder={`Search`}
                        className={`${isOpen ? 'bg-transparent ring-2 ring-sky-500' : ''} bg-[#2a2d32b3] relative z-20 w-full px-12 py-3 rounded-full font-light focus:outline-0 placeholder:text-[#71767b] ${isOpen ? 'placeholder:text-sky-500' : ''}`}
                    />
                </form>

                <HiMiniMagnifyingGlass className={`absolute top-1/2 left-3 -translate-y-1/2 size-5 z-10 ${isOpen ? 'text-sky-500' : 'text-white'}`}/>
                {(isOpen && searchValue !== '') &&
                    <div
                        onClick={() => setSearchValue('')}
                        className={`absolute bg-sky-500 hover:bg-sky-600 transition top-1/2 right-5 -translate-y-1/2 z-30 text-black rounded-full p-[2px] cursor-pointer`}>
                        <HiMiniXMark
                            className={`size-5`}/>
                    </div>
                }

            {/*  Search result  */}
                {
                    isOpen &&
                    <div
                        className={`bg-black absolute w-full rounded-lg shadow-[0px_0px_7px_-2px_white] max-h-[40rem] overflow-y-scroll mt-2 z-[100] flex flex-col gap-y-2`}>
                        {(searchResults && debounceValue) &&
                            <div
                                onClick={() => {
                                    props.setPageUrl && props.setPageUrl('')
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
