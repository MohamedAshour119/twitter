export interface Tweet {
    title: string | null;
    user_id: number;
    image: string | null;
    video: string | null;
    show_tweet_created_at: string;
    updated_at: string;
    created_at: string;
    id: number;
    retweet_to: number | null;
    comment_to: number | null;
    reactions_count: number;
    retweets_count: number,
    comments_count: number;
    is_reacted: boolean;
    is_retweeted: boolean;
}

export interface TweetInfo extends Tweet{
    user: {
        id: number;
        username: string;
        avatar: string,
    }

    main_tweet: Tweet
}

export interface UserInfo {
    id: number | null;
    username: string;
    email: string;
    gender: string;
    avatar: string;
    birth_date: string;
    ban_status: number | null;
    created_at: string;
    updated_at: string;
    following_number: number | null;
    followers_number: number | null;
    is_followed: boolean;
    tweets_count: number | null;
}

export interface ClickedTweet {
    user: {
        id: number,
        username: string,
        avatar: string,
    }
    tweet: {
        title: string | null,
        created_at: string,
        id: number | null,
        comments_count: number,
    }
}

export interface TweetNotification {
    id: number | null
    username: string
    email: string
    gender: string
    avatar: string
    birth_date: string
    ban_status: boolean
    created_at: string
    updated_at: string
}