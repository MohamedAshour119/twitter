import {Link} from "react-router-dom";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {Dispatch, SetStateAction, useContext} from "react";
import {AppContext} from "../appContext/AppContext.tsx";
import {Tweet} from "../../Interfaces.tsx";

interface Props {
    addTweetInfo: () => void
    setDisableLink: Dispatch<SetStateAction<boolean>>
    setTweetMenuOpen: Dispatch<SetStateAction<boolean>>
    tweetMenuOpen: boolean
    username: string
    avatar: string
    comment_to: number | null
    main_tweet: Tweet
    created_at: string
    main_tweet_created_at: string
    title: string | null
    main_tweet_title: string | null
    image: string | null
    main_tweet_image: string | null
    video: string | null
    main_tweet_video: string | null
    show_tweet_created_at: string
    main_tweet_show_tweet_created_at: string
}
function TweetCommonContent(props: Props) {

    const {baseUrl, clickedTweet} = useContext(AppContext)


    return (
        <div onClick={props.addTweetInfo} className={`grid py-3 sm:px-6 px-2 gap-x-2`}>
            <div className={`flex gap-x-2`}>
                <Link to={`/users/${props.username}`} className={`md:w-[10%] w-[14%]`}>
                    <img
                        className={`size-11 object-cover rounded-full select-none`}
                        src={`${baseUrl}/storage/${props.avatar}`}
                        alt=""
                    />
                </Link>
                <div className={`flex gap-x-2 justify-between items-start w-full`}>
                    <div className={`flex sm:gap-x-2 gap-x-5 xxs:gap-x-2`}>
                        <Link to={`/users/${props.username}`} className={`xs:flex gap-x-2 ${location?.pathname === `/tweets/${clickedTweet.tweet.id}` && !props.comment_to ? 'flex-col' : 'flex-row'}`}>
                            <h1 className={`font-semibold cursor-pointer`}>{props.username}</h1>
                            <h1 className={`font-light text-[#71767b] cursor-pointer`}>@{props.username}</h1>
                        </Link>
                        {(location?.pathname === `/home` || props.comment_to) &&
                            <span className={`font-light text-[#71767b] cursor-pointer`}>
                                                {!props.main_tweet ? props.created_at : props.main_tweet.created_at}
                                            </span>
                        }
                    </div>
                    <div
                        onClick={() => props.setTweetMenuOpen(!props.tweetMenuOpen)}
                        onMouseEnter={() => props.setDisableLink(true)}
                        onMouseLeave={() => props.setDisableLink(false)}
                        className={`font-light text-[#71767b] text-2xl p-1 cursor-pointer hover:bg-sky-500/20 hover:text-sky-300 rounded-full flex justify-center items-center transition`}>
                        <HiOutlineDotsHorizontal/>
                    </div>
                </div>
            </div>

            <div className={`w-[90%] justify-self-end`}>
                <div className={`grid grid-cols-1`}>
                    <p className={`w-fit break-all`}>{!props.main_tweet ? props.title : props.main_tweet.title}</p>
                    <div className={`${props.title?.length ?? 0 ? '' : 'mt-4'}`}>
                        {(props.image || props.main_tweet?.image) &&
                            <img
                                className={`rounded-2xl max-h-[40rem] w-full ${props.image || props.main_tweet?.image ? 'mt-4' : ''}`}
                                src={`${baseUrl}/storage/${!props.main_tweet ? props.image : props.main_tweet?.image}`}
                                alt="post_image"
                            />}

                        {(props.video || props.main_tweet?.video) &&
                            <video
                                className={`max-h-[40rem] w-full rounded-2xl ${props.video || props.main_tweet?.video ? 'mt-4' : ''}`}
                                controls
                                src={`${baseUrl}/storage/${!props.main_tweet ? props.video : props.main_tweet?.video}`}
                            />}

                        {(location?.pathname !== `/home` && !props.comment_to) &&
                            <div className={`font-light text-[#71767b] cursor-pointer mt-3`}>
                                {!props.main_tweet ? props.show_tweet_created_at : props.main_tweet.show_tweet_created_at}
                            </div>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default TweetCommonContent
