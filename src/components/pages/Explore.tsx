import Model from "../layouts/Model.tsx";
import {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import useDebounce from "../hooks/UseDebounce.tsx";
import ApiClient from "../ApiClient.tsx";
import {Hashtag, TweetInfo, UserInfo} from "../../Interfaces.tsx";
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
        isSearched,
        displayNotResultsFound,
        setDisplayNotResultsFound,
        isSidebarSearchLoading,
        setIsSidebarSearchLoading,
        setIsSearched,
    } = useContext(AppContext)

    const {
        setTweets,
    } = useContext(TweetContext)

    const [isOpen, setIsOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [searchResults, setSearchResults] = useState<UserInfo[]>([])
    const [exploreResultsNextPageUrl, setExploreResultsNextPageUrl] = useState('')
    const [explorePageHashtags, setExplorePageHashtags] = useState<Hashtag[]>([])
    const [showExplorePageHashtags, setShowExplorePageHashtags] = useState(true)
    const [loadingExplorePage, setLoadingExplorePage] = useState(true)
    const [results, setResults] = useState<TweetInfo[]>([])
    const [resultsNextPageUrl, setResultsNextPageUrl] = useState('')
    const [isFetching, setIsFetching] = useState(false);
    const [hasScrollbar, setHasScrollbar] = useState(false);
    const [isSearchForSpecificKeywordClicked, setIsSearchForSpecificKeywordClicked] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const storedResults = localStorage.getItem('tweets_results')
        const nextPageUrl = localStorage.getItem('tweets_results_next_page_url')
        if (storedResults && nextPageUrl && isSearched !== null) {
            setResults(JSON.parse(storedResults));
            setResultsNextPageUrl(JSON.parse(nextPageUrl))
        } else {
            setResults([]);
            setResultsNextPageUrl('')
        }
    }, [isSearched]);

    useEffect(() => {
        localStorage.removeItem('tweets_results');
        localStorage.removeItem('tweets_results_next_page_url');
    }, []);

    const debounceValue = useDebounce(searchValue)
    const handleOpen = () => {
        setIsOpen(true)
    }

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }

    const getSearchResult = (keyword: string) => {
        setIsFetching(true)
        setSearchLoading(true)
        const url = keyword?.startsWith("http://api.twitter.test/api") ? keyword : `/search-user/${keyword}`;
        ApiClient().get(url)
            .then(res => {
                if (isSearchForSpecificKeywordClicked) {
                    setResults(prevState => ([
                        ...prevState,
                        ...res.data.data.results
                    ]))
                    setResultsNextPageUrl(res.data.data.results_next_page_url)
                }
                setSearchResults(res.data.data.users)
                setExploreResultsNextPageUrl(res.data.data.users_next_page_url)
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setIsFetching(false)
                setSearchLoading(false)
            })
    };


    useEffect(() => {
        if (debounceValue?.length > 0) {
            getSearchResult(debounceValue);
        } else {
            setSearchResults([])
        }
    }, [debounceValue, isSearchForSpecificKeywordClicked]);


    useEffect(() => {
        setTweets([])

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

    useEffect(() => {
        setTimeout(() => {
            setIsSidebarSearchLoading(false)
        }, 1000)
    }, [isSearched]);


    const exploreSearchRef = useRef<HTMLDivElement>(null);
    const specificSearchRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (specificSearchRef.current) {
                !exploreSearchRef.current?.contains(e.target as Node) && !specificSearchRef.current.contains(e.target as Node) ? setIsOpen(false) : null
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => {
            document.removeEventListener('mousedown', handleClick)
        }
    }, []);

    const lastExploreResultRef = useRef(null)
    const users = searchResults.map((user, index) => {
        return(
            <SearchResult
                key={index}
                {...user}
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                ref={index === searchResults.length -1 ? lastExploreResultRef : null}
            />
        )
    })

    const lastResultRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!results.length && isSidebarSearchLoading) return;

        if (lastResultRef.current && !isSidebarSearchLoading && !isFetching && resultsNextPageUrl) {
            const observer = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && !isSidebarSearchLoading) {
                    console.log(lastResultRef);
                    getSearchResult(resultsNextPageUrl);
                }
            }, {
                threshold: 0.5
            });

            observer.observe(lastResultRef.current);

            return () => {
                if (lastResultRef.current) {
                    observer.unobserve(lastResultRef.current);
                }
            };
        }
    }, [resultsNextPageUrl, results, !isSidebarSearchLoading, isFetching]);

    const displayResults: React.ReactNode = results?.map((tweet, index) => (
        <Tweet
            key={index}
            {...tweet}
            ref={index === results.length - 1 ? lastResultRef : null}
        />
    ));

    // const searchForKeyword = (keyword: string) => {
    //     setDisplayNotResultsFound(false)
    //     setLoadingExplorePage(true)
    //     setExplorePageHashtags([])
    //     ApiClient().get(`/search/${keyword}`)
    //         .then((res) => {
    //             setTweets( prevResults => ([
    //                 ...prevResults,
    //                 ...res.data.data.tweets
    //             ]))
    //             if(res.data.data.tweets.length === 0) {
    //                 setDisplayNotResultsFound(true)
    //             } else {
    //                 setShowExplorePageHashtags(true)
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err)
    //         })
    //         .finally(() => setLoadingExplorePage(false))
    // }

    const inputRef = useRef<HTMLInputElement>(null)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (debounceValue !== '' && !searchLoading) {
            // setIsSearched(!isSearched);
            setShowExplorePageHashtags(false)
            setDisplayNotResultsFound(false)
            e.preventDefault()
            setResultsNextPageUrl('')
            getSearchResult(debounceValue)
            setIsOpen(false)
            setSearchValue('')
            inputRef.current?.blur() // To disable auto focus after 'handleSubmit' called
        }
    }


    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!exploreSearchRef.current?.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);


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

    const scrollableDivRef = useRef<HTMLDivElement>(null);
    const checkForScrollbar = () => {
        const element = scrollableDivRef.current;
        if (element) {
            // Delay the check to ensure the content is fully rendered
            requestAnimationFrame(() => {
                const hasVerticalScroll = element.scrollHeight > element.clientHeight;
                setHasScrollbar(hasVerticalScroll);
            });
        }
    };

    useEffect(() => {
        requestAnimationFrame(() => {
            if (results.length > 0) {
                checkForScrollbar();
            }
        })
    }, [results, isSearched]);


    return (
        <div
            className={`border min-h-svh border-t-0 border-zinc-700/70`}>
            <header className={`border-b border-zinc-700/70 fixed z-[200] grid grid-cols-1 py-2 ${isModalOpen || isCommentOpen ? 'opacity-20 pointer-events-none ' : 'backdrop-blur-sm'}  px-6 ${hasScrollbar ? '3xl:max-w-[42.80rem] md:max-w-[37.58rem] sm:max-w-[29.9rem] xs:max-w-[31.15rem] xxs:max-w-[27.7rem]' : '3xl:max-w-[42.90rem] md:max-w-[37.58rem] sm:max-w-[29.85rem] xs:max-w-[31.15rem] xxs:max-w-[27.70rem] w-full'} 2xl:max-w-[38.50rem] xl:max-w-[31.60rem] lg:max-w-[31.52rem] w-[99.5%]`}>
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
                            className={`${isOpen ? 'bg-transparent ring-2 ring-sky-500' : ''} text-neutral-200 bg-[#121416] relative z-20 w-full px-6 py-3 rounded-full font-light focus:outline-0 placeholder:text-[#71767b] ${isOpen ? 'placeholder:text-sky-500' : ''}`}
                        />
                    </form>

                    {
                        (isOpen && debounceValue.length > 0) &&
                        <div
                            className={`bg-black absolute w-full text-neutral-200 rounded-lg max-h-[40rem] ${searchResults.length >= 7 ? 'overflow-y-scroll' : ''} mt-2 z-[100] flex flex-col gap-y-2 border-2 border-[#121416]`}>
                            {(searchResults && debounceValue) &&
                                <div
                                    ref={specificSearchRef}
                                    onClick={() => {
                                        console.log(isSearched)
                                        if (!isSearched) {
                                            setShowExplorePageHashtags(false)
                                            setIsSearchForSpecificKeywordClicked(!isSearchForSpecificKeywordClicked)
                                            getSearchResult(debounceValue)
                                            setIsOpen(false)
                                            setSearchValue('')
                                        }
                                    }}
                                    className={`p-4 ${searchResults.length > 0 ? 'border-b' : ''} ${searchLoading ? 'pointer-events-none' : ''} border-zinc-700/70 cursor-pointer hover:bg-[#1c1e2182] transition`}
                                >
                                    Search for "{debounceValue}"
                                </div>
                            }
                            {users}
                        </div>
                    }

                    {!debounceValue &&
                        <HiMiniMagnifyingGlass
                        className={`absolute top-1/2 right-6 -translate-y-1/2 size-5 z-10 ${isOpen ? 'text-sky-500' : 'text-white'}`}/>
                    }
                    {(isOpen && debounceValue !== '') &&
                        <div
                            onClick={() => {
                                setIsOpen(false)
                                setSearchValue('')
                            }}
                            className={`absolute bg-sky-500 hover:bg-sky-600 transition top-1/2 right-6 -translate-y-1/2 z-30 text-black rounded-full p-[2px] cursor-pointer`}>
                            <HiMiniXMark
                                className={`size-5`}/>
                        </div>
                    }
                </div>
            </header>
            <div
                ref={scrollableDivRef}
                className={`${(isModalOpen || isCommentOpen) ? 'opacity-20 pointer-events-none mt-16' : ''} `}>
                {/* Middle content */}
                <div
                    className={`text-neutral-200 w-full relative`}>

                    <div className={`mt-20`}>
                        {(showExplorePageHashtags && results.length === 0 && !loadingExplorePage && !isSidebarSearchLoading && !displayNotResultsFound) &&
                            <div>
                                {hashtags}
                            </div>
                        }
                        {results.length > 0 && !isSidebarSearchLoading && !searchLoading && displayResults}
                        {(loadingExplorePage || isSidebarSearchLoading || (searchLoading && debounceValue.length > 0 &&  !isOpen)) && <SpinLoader/>}

                        {displayNotResultsFound && !loadingExplorePage && !isSidebarSearchLoading &&
                            <div className={`px-10 py-5 pt-40 flex flex-col gap-y-3 items-center text-3xl `}>
                                No {results.length === 0 ? 'results found' : 'tweets,'}! {results.length !== 0 ? 'come back later' : ''}
                                <CgSmileSad  className={`size-20 text-sky-500`}/>
                            </div>
                        }
                    </div>

                </div>
            </div>
            {/* Tweet model  */}
            <Model/>
        </div>
    )
}

export default Explore
