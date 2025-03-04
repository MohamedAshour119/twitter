import {HiMiniMagnifyingGlass, HiMiniXMark} from "react-icons/hi2";
import TrendingHashtag from "./TrendingHashtag.tsx";
import FollowUser from "./FollowUser.tsx";
import {ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import useDebounce from "../hooks/UseDebounce.tsx";
import ApiClient from "../ApiClient.tsx";
import SearchResult from "./SearchResult.tsx";
import {Hashtag, UserInfo} from "../../Interfaces.tsx";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import Skeleton from "../partials/Skeleton.tsx";
import SpinLoader from "../helper/SpinLoader.tsx";

interface Props {
    setPageUrl?: Dispatch<SetStateAction<string>>
    setDisplayNotFoundMsg?: Dispatch<SetStateAction<boolean>>
    loadingExplorePage?: boolean
    setLoadingExplorePage?: Dispatch<SetStateAction<boolean>>
    app_hashtags: Hashtag[]
    is_loading: boolean
    suggested_users_to_follow: UserInfo[]
}

function TrendingSidebar(props: Props) {

    const {
        isModalOpen,
        isCommentOpen,
        isShowEditInfoModal,
        setIsSearched,
        isSearched,
        setDisplayNotResultsFound,
        setIsSidebarSearchLoading,
    } = useContext(AppContext)

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(props.is_loading);
    const [searchResults, setSearchResults] = useState<UserInfo[]>([])
    const [searchResultsNextPageUrl, setSearchResultsNextPageUrl] = useState('');
    const [suggestedUsersToFollow, setSuggestedUsersToFollow] = useState<UserInfo[]>(props.suggested_users_to_follow || [])
    const [hashtags, setHashtags] = useState<Hashtag[]>(props.app_hashtags)
    const [searchValue, setSearchValue] = useState('')
    const [isHashtagDeleted, setIsHashtagDeleted] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isResultsNotExists, setIsResultsNotExists] = useState(false);


    const navigate = useNavigate()
    const debounceValue = useDebounce(searchValue)

    useEffect(() => {
        setHashtags(props.app_hashtags)
    }, [props.app_hashtags]);

    useEffect(() => {
        setIsLoading(props.is_loading)
    }, [props.is_loading]);

    useEffect(() => {
        setSuggestedUsersToFollow(props.suggested_users_to_follow)
    }, [props.suggested_users_to_follow]);

    const sendRequest = () => {
        // setIsSidebarSearchLoading(true) // This to handle results which are fetched from TrendingSidebar.tsx in Explore page
        setSearchLoading(true)
        if (props.setLoadingExplorePage) {
            props.setLoadingExplorePage(false);
        }
        ApiClient().get(`/search-user/${debounceValue}`)
            .then(res => {
                setSearchResults(res.data.data.users)
                const nextPageUrl = res.data.data.users_next_page_url
                nextPageUrl ? setSearchResultsNextPageUrl(nextPageUrl) : null
                const storedResults = localStorage.getItem('tweets_results')
                const storedNextPageUrl = localStorage.getItem('tweets_results_next_page_url')
                if (storedResults || storedNextPageUrl) {
                    localStorage.removeItem('tweets_results');
                    localStorage.removeItem('tweets_results_next_page_url');
                }
                localStorage.setItem('tweets_results', JSON.stringify(res.data.data.results))
                localStorage.setItem('tweets_results_next_page_url', JSON.stringify(res.data.data.results_next_page_url))
                const results = res.data.data.results
                results.length === 0 ? setIsResultsNotExists(true) : setIsResultsNotExists(false)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setSearchLoading(false)
            })
    }

    const getHashtags = () => {
        setIsLoading(true)
        if (location.pathname !== '/home') {
            ApiClient().get(`/hashtags`)
                .then(res => {
                    setHashtags(res.data.data.hashtags)
                    setSuggestedUsersToFollow(res.data.data.suggested_users)
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => setIsLoading(false))
        }
    }

    useEffect(() => {
        if((hashtags?.length === 0 && !isLoading) || isHashtagDeleted) {
            getHashtags()
        }
    }, [hashtags?.length]);

    useEffect(() => {
        if (location.pathname !== '/home' && isHashtagDeleted) {
            ApiClient().get('suggested-users')
                .then(res => {
                    setSuggestedUsersToFollow(res.data.data.suggested_users)
                })
        }
    }, []);


    const getSearchResult = (pageURL: string) => {
        setIsFetching(true)
        ApiClient().get(pageURL)
            .then(res => {
                setSearchResults(prevSearchedResults => [
                    ...prevSearchedResults,
                    ...res.data.data.users
                ])
                const nextPageUrl = res.data.data.users_next_page_url
                setSearchResultsNextPageUrl(nextPageUrl ? nextPageUrl : '')
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => setIsFetching(false))
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
    const lastResultRef = useRef<HTMLAnchorElement>(null)
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !isFetching) {
                getSearchResult(searchResultsNextPageUrl)
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
    }, [lastResultRef, isFetching, searchResultsNextPageUrl])

    const users = searchResults.map((user, index) => {
        return(
            <SearchResult
                key={index}
                {...user}
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                ref={index === searchResults.length - 1 ? lastResultRef : null}
            />
        )
    })

    const popupMenu = useRef<HTMLDivElement>(null)

    const trendingHashtags = hashtags?.map(hashtag => {
        return (
            <TrendingHashtag
                key={hashtag.id}
                id={Number(hashtag.id)}
                hashtag={hashtag.hashtag}
                count={hashtag.count}
                hashtags={hashtags}
                setHashtags={setHashtags}
                setIsHashtagDeleted={setIsHashtagDeleted}
            />
        )
    })

    const inputRef = useRef<HTMLInputElement>(null)
    const handleSubmit =  (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (debounceValue !== '' && !searchLoading) {
            setIsSearched(!isSearched);
            props.setLoadingExplorePage && props.setLoadingExplorePage(true);
            setDisplayNotResultsFound(isResultsNotExists);
            setIsSidebarSearchLoading(true)
            navigate('/explore');
            setIsOpen(false);
            setSearchValue('');
            inputRef.current?.blur(); // Disable auto-focus after the search
        }
    };

    return (
        <div className={`${isModalOpen || isCommentOpen || isShowEditInfoModal ? 'opacity-20 pointer-events-none' : ''} z-[300] text-neutral-100 flex-col gap-y-8 h-svh w-[22.5rem] hidden lg:flex justify-self-end fixed`}>
            <div ref={searchRef} className={`mt-2 relative`}>
                <form onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        onClick={handleOpen}
                        onChange={handleSearchChange}
                        value={searchValue}
                        type="text"
                        placeholder={`Search`}
                        className={`${isOpen ? 'bg-transparent ring-2 ring-sky-500' : ''} bg-[#121416] relative z-20 w-full px-12 py-3 rounded-full font-light focus:outline-0 placeholder:text-[#71767b] ${isOpen ? 'placeholder:text-sky-500' : ''}`}
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
                    isOpen && debounceValue.length > 0 &&
                    <div
                        className={`${searchLoading ? 'pb-4' : ''} bg-black absolute w-full rounded-lg border-2 border-[#121416] max-h-[40rem] ${searchResults.length >= 7 ? 'overflow-y-scroll' : ''} mt-2 z-[100] flex flex-col gap-y-2`}>
                        {(debounceValue !== '') &&
                            <div
                                onClick={() => {
                                    props.setPageUrl && props.setPageUrl('')
                                    setIsSearched(!isSearched)
                                    setDisplayNotResultsFound(isResultsNotExists);
                                    setIsSidebarSearchLoading(true)
                                    navigate('/explore')
                                    setIsOpen(false)
                                    setSearchValue('')
                                }}
                                className={`p-4 ${searchResults.length > 0 || searchLoading ? 'border-b' : ''} ${searchLoading ? 'pointer-events-none' : ''} border-zinc-700/70 cursor-pointer hover:bg-[#1c1e2182] transition`}
                            >
                                Search for "{debounceValue}"
                            </div>
                        }
                        {searchLoading && <SpinLoader styles={`translate-y-0 sm:translate-y-0 mt-2`}/>}
                        {!searchLoading && users}
                    </div>
                }

            </div>

            <div className={`bg-[#121416] rounded-2xl pb-4`}>
                <h1 className={`font-bold text-2xl p-4`}>What's happening</h1>

                {hashtags?.length > 0 && <div ref={popupMenu} className={`mt-6 flex flex-col gap-y-2 pb-3`}>{trendingHashtags}</div>}
                {hashtags?.length === 0 && !isLoading && suggestedUsersToFollow.length > 0 &&
                    <div className={`text-center`}>There is no trends right now.</div>
                }
                {(isLoading && hashtags?.length === 0) &&
                    <SpinLoader/>
                }
            </div>

            <div className={`bg-[#121416] rounded-2xl`}>
                <h1 className={`font-bold text-2xl p-4`}>Who to follow</h1>
                <div className={`flex flex-col gap-y-2`}>
                    {suggestedUsersToFollow?.length === 0 &&
                        <div role="status" className="max-w-sm animate-pulse px-4 py-3 flex flex-col gap-y-8">
                            <Skeleton styles={`h-12 w-full`}/>
                            <Skeleton styles={`h-12 w-full`}/>
                            <Skeleton styles={`h-12 w-full`}/>
                        </div>
                    }

                    {suggestedUsersToFollow.length > 0 && suggestedUsersToFollow?.map((user, index) => (
                        <FollowUser
                            key={user.user_info.id}
                            suggestedUsersToFollow={user}
                            styles={index === suggestedUsersToFollow?.length - 1 ? ' rounded-b-2xl' : ''}
                        />
                    ))}
                </div>
            </div>

        </div>
    )
}

export default TrendingSidebar
