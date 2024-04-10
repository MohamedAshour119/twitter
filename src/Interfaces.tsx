export interface Tweet {
    title: string | null
    user_id: number
    image: string | null
    video: string | null
    show_tweet_created_at: string
    updated_at: string
    created_at: string
    id: number
    retweet_to: number | null
    comment_to: number | null
    reactions_count: number
    retweets_count: number
    comments_count: number
    is_reacted: boolean
    is_retweeted: boolean
}

export interface TweetInfo extends Tweet{
    user: {
        id: number
        username: string
        avatar: string
    }

    main_tweet: Tweet
}

export interface UserInfo {
    id: number
    username: string
    email: string
    gender: string
    avatar: string
    birth_date: string
    ban_status: number | null
    created_at: string
    updated_at: string
    following_number: number | null
    followers_number: number | null
    is_followed: boolean
    tweets_count: number | null
}

export interface ClickedTweet {
    user: {
        id: number
        username: string
        avatar: string
    }
    tweet: {
        title: string | null
        created_at: string
        id: number | null
        comments_count: number
    }
}

export interface Notification {
    id: number | null
    type: string
    tweet_id: number | null
    is_read: boolean
    follower_id: number | null
    followed_id: number | null
    created_at: string
    user: UserInfo
}

export interface Hashtag {
    id: number
    hashtag: string
    count: number
}

export const tweetDefaultValues = {
    user: {
        id: 0,
        username: '',
        avatar: '',
    },
    title: '',
    user_id: 0,
    image: '',
    video: '',
    show_tweet_created_at: '',
    updated_at: '',
    created_at: '',
    id: 0,
    retweet_to: null,
    comment_to: null,
    reactions_count: 0,
    retweets_count: 0,
    is_reacted: false,
    is_retweeted: false,
    comments_count: 0,
    main_tweet: {
        title: '',
        user_id: 0,
        image: '',
        video: '',
        show_tweet_created_at: '',
        updated_at: '',
        created_at: '',
        id: 0,
        retweet_to: null,
        comment_to: null,
        reactions_count: 0,
        retweets_count: 0,
        comments_count: 0,
        is_reacted: false,
        is_retweeted: false,
    }
}

export const UserDefaultValues =
    {
        id: 0,
        username: '',
        email: '',
        gender: '',
        avatar: '',
        birth_date: '',
        ban_status: null,
        created_at: '',
        updated_at: '',
        following_number: null,
        followers_number: null,
        is_followed: false,
        tweets_count: null,
    }
export const ClickedTweetDefaultValues =
    {
        user: {
            id: 0,
            username: '',
            avatar: ''
        },

        tweet: {
            title: '',
            created_at: '',
            id: null,
            comments_count: 0,
        },
    }
