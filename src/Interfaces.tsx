interface Tweet {
    title: string;
    user_id: number;
    image: string | null;
    video: string | null;
    updated_at: string;
    created_at: string;
    id: number;
    retweet_to: number | null;
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
    is_followed: boolean | null;
    tweets_count: number | null;
}