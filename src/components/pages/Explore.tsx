import Model from "../layouts/Model.tsx";
import {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import useDebounce from "../hooks/UseDebounce.tsx";
import ApiClient from "../services/ApiClient.tsx";
import {Hashtag, UserInfo} from "../../Interfaces.tsx";
import {HiMiniMagnifyingGlass, HiMiniXMark} from "react-icons/hi2";
import SearchResult from "../layouts/SearchResult.tsx";
import {TweetContext} from "../appContext/TweetContext.tsx";
import * as React from "react";
import Tweet from "../layouts/Tweet.tsx";
import {CgSmileSad} from "react-icons/cg";
import ExploreHashtag from "../layouts/ExploreHashtag.tsx";
import SpinLoader from "../helper/SpinLoader.tsx";


function Explore() {

    const {
        isModalOpen,
        isCommentOpen,
        displayNotResultsFound,
        setDisplayNotResultsFound,
    } = useContext(AppContext)

    const {
        randomTweets,
        setRandomTweets,
    } = useContext(TweetContext)

    const [isOpen, setIsOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [searchResults, setSearchResults] = useState<UserInfo[]>([])
    const [pageURL, setPageURL] = useState('')
    const [explorePageHashtags, setExplorePageHashtags] = useState<Hashtag[]>([])
    const [showExplorePageHashtags, setShowExplorePageHashtags] = useState(true)
    const [loadingExplorePage, setLoadingExplorePage] = useState(true);
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

    useEffect(() => {
        setShowExplorePageHashtags(true)
        ApiClient().post('/explore-page-hashtags')
            .then(res => {
                setExplorePageHashtags([...res.data.data.hashtags])
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => setLoadingExplorePage(false))
    }, []);


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
        setDisplayNotResultsFound(false)
        setLoadingExplorePage(true)
        setExplorePageHashtags([])
        ApiClient().get(`/search/${keyword}`)
            .then((res) => {
                setRandomTweets( prevResults => ([
                    ...prevResults,
                    ...res.data.data.tweets
                ]))
                if(res.data.data.tweets.length === 0) {
                    setDisplayNotResultsFound(true)
                } else {
                    setShowExplorePageHashtags(true)
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => setLoadingExplorePage(false))
    }

    useEffect(() => {
        setRandomTweets([])
    }, []);

    useEffect(() => {
        setDisplayNotResultsFound(false)
    }, [location.pathname]);


    const displayResults: React.ReactNode = randomTweets?.slice(0, randomTweets.length - 1).map(tweetInfo => (
        <Tweet
            key={tweetInfo.id}
            {...tweetInfo}
        />
    ));

    const inputRef = useRef<HTMLInputElement>(null)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        setDisplayNotResultsFound(false)
        e.preventDefault()
        setPageURL('')
        setRandomTweets([])
        searchForKeyword(searchValue)
        setIsOpen(false)
        setSearchValue('')
        inputRef.current?.blur() // To disable auto focus after 'handleSubmit' called
    }

    const hashtags = explorePageHashtags.map(hashtag => {
        return (
            <ExploreHashtag
                key={hashtag.id}
                id={Number(hashtag.id)}
                hashtag={hashtag.hashtag}
                count={hashtag.count}
                setExplorePageHashtags={setExplorePageHashtags}
                explorePageHashtags={explorePageHashtags}
            />
        )
    })

    return (
        <div className={`${!loadingExplorePage ? 'border' : ''} min-h-svh border-t-0 border-zinc-700/70`}>
            <header className={`fixed z-[200] grid grid-cols-1 mt-2 ${isModalOpen || isCommentOpen ? 'opacity-20 pointer-events-none ' : 'backdrop-blur-sm'}  px-6 3xl:max-w-[42.90rem] 2xl:max-w-[38.50rem] xl:max-w-[31.60rem] lg:max-w-[31.52rem] md:max-w-[37.62rem] sm:max-w-[29.2rem] xs:max-w-[31.15rem] xxs:max-w-[27.74rem] w-full`}>
                <div
                    ref={exploreSearchRef}
                    className={`w-full relative`}>
                    <form onSubmit={handleSubmit}>
                        <input
                            ref={inputRef}
                            onClick={handleOpen}
                            onChange={handleSearchChange}
                            value={searchValue}
                            type="text"
                            placeholder={`Search`}
                            className={`${isOpen ? 'bg-transparent ring-2 ring-sky-500' : ''} text-neutral-200 bg-[#2a2d32b3] relative z-20 w-full px-6 py-3 rounded-full font-light focus:outline-0 placeholder:text-[#71767b] ${isOpen ? 'placeholder:text-sky-500' : ''}`}
                        />
                    </form>

                    {
                        isOpen &&
                        <div
                            className={`bg-black absolute w-full text-neutral-200 rounded-lg shadow-[0px_0px_7px_-2px_white] max-h-[40rem] overflow-y-scroll mt-2 z-[100] flex flex-col gap-y-2`}>
                            {(searchResults && debounceValue) &&
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

                    {searchValue || <HiMiniMagnifyingGlass
                        className={`absolute top-1/2 right-6 -translate-y-1/2 size-5 z-10 ${isOpen ? 'text-sky-500' : 'text-white'}`}/>}
                    {(isOpen && searchValue !== '') &&
                        <div
                            onClick={() => setSearchValue('')}
                            className={`absolute bg-sky-500 hover:bg-sky-600 transition top-[35%] right-6 -translate-y-1/2 z-30 text-black rounded-full p-[2px] cursor-pointer`}>
                            <HiMiniXMark
                                className={`size-5`}/>
                        </div>
                    }
                </div>
            </header>
            <div
                className={`${(isModalOpen || isCommentOpen) ? 'opacity-20 pointer-events-none mt-16' : ''} `}>
                {/* Middle content */}
                <div
                    className={`text-neutral-200 w-full relative`}>

                    <div className={`mt-20`}>
                        {(showExplorePageHashtags && randomTweets.length == 0 && !loadingExplorePage) &&
                            <div>
                                {hashtags}
                            </div>
                        }
                        {!loadingExplorePage && displayResults}
                        {loadingExplorePage && <SpinLoader/>}
                        <div ref={lastResultRef}>
                            {randomTweets.length > 0 && (
                                <Tweet {...randomTweets[randomTweets.length - 1]} />
                            )}
                        </div>

                        {displayNotResultsFound && randomTweets.length === 0 &&
                            <div className={`px-10 py-5 pt-40 flex flex-col gap-y-3 items-center text-3xl `}>
                                No {displayNotResultsFound ? 'results found' : 'tweets,'}! {!displayNotResultsFound ? 'come back later' : ''}
                                <CgSmileSad  className={`size-20 text-sky-500`}/>
                            </div>
                        }
                    </div>

                </div>
                {/*<TrendingSidebar setDisplayNotFoundMsg={setDisplayNotFoundMsg} setPageUrl={setPageURL} />*/}
            </div>
            {/* Tweet model  */}
            <Model/>
        </div>
    )
}

export default Explore
