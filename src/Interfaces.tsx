export interface TweetInfo {
    user: {
        id: number;
        username: string;
        avatar: string,
    }

    title: string;
    user_id: number;
    image: string | null;
    video: string | null;
    updated_at: string;
    created_at: string;
    id: number;
    retweet_to: string | null;

    reactions_count: number;
    retweets_count: number,
    is_reacted: boolean;
    is_retweeted: boolean;
    comments_count: number;
}
