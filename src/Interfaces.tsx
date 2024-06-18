export interface Tweet {
    title: string | null
    user_id: number
    image: string | null
    video: string | null
    show_tweet_created_at: string
    updated_at: string
    created_at: string
    is_pinned: boolean
    id: number
    retweet_to: number | null
    comment_to: number | null
    reactions_count: number
    retweets_count: number
    comments_count: number
    is_reacted: boolean
    is_retweeted: boolean

    user: {
        user_info: {
            id: number
            username: string
            avatar: string
            display_name: string
            is_followed: boolean
        };
    }
}

export interface TweetInfo extends Tweet{
    user: {
        user_info: {
            id: number
            username: string
            avatar: string
            display_name: string
            is_followed: boolean
        };
    }

    main_tweet: Tweet
}

export interface UserInfo {
    user_info: {
        id: number
        username: string
        email: string
        gender: string
        display_name: string
        bio: string
        avatar: string
        cover: string
        birth_date: string
        ban_status: number | null
        created_at: string
        updated_at: string
        following_number: number | null
        followers_number: number | null
        is_followed: boolean
        tweets_count: number | null
    }

    allNotifications: {
        notifications_info: Notification[],
        notifications_count: number | null
    }
    originalNotifications: Notification[]
}

export interface Notification {
    id: number | null
    type: string
    tweet_id: number | null
    is_read: boolean
    follower_id: number | null
    followed_id: number | null
    created_at: string
    user: {
        username: string
        avatar: string
    }
}

export interface Hashtag {
    id: number | string
    hashtag: string
    count: number
}

export interface FormError {
    username: string[]
    email: string[]
    password: string[]
    password_confirmation: string[]
    gender: string[]
    birth_date: string[]
    avatar: string[]
    cover: string[]
    display_name: string[]
    bio: string[]
    current_password: string[]
    new_password: string[]
    new_password_confirmation: string[]
}

export interface RegisterUser {
    username: string
    email: string
    password: string
    password_confirmation: string
    gender: string
    date_birth: string
    avatar: string | File | null | undefined
}

export interface EditUserProfile {
    display_name: string
    bio: string
    password: string
    password_confirmation: string
    birth_date: string
    avatar: string | File | null | undefined
    cover: string | File | null | undefined
}

export interface Gender {
    value: string
    label: string
}

export const tweetDefaultValues = {
    user: {
        user_info: {
            id: 0,
            username: '',
            avatar: '',
            display_name: '',
            is_followed: false,
        }
    },
    title: '',
    user_id: 0,
    image: '',
    video: '',
    show_tweet_created_at: '',
    updated_at: '',
    created_at: '',
    is_pinned: false,
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
        is_pinned: false,
        id: 0,
        retweet_to: null,
        comment_to: null,
        reactions_count: 0,
        retweets_count: 0,
        comments_count: 0,
        is_reacted: false,
        is_retweeted: false,
        user: {
            user_info: {
                id: 0,
                username: '',
                avatar: '',
                display_name: '',
                is_followed: false,
            }
        },
    }
}

export const UserDefaultValues =
    {
        user_info: {
            id: 0,
            username: '',
            email: '',
            gender: '',
            display_name: '',
            bio: '',
            avatar: '',
            cover: '',
            birth_date: '',
            ban_status: null,
            created_at: '',
            updated_at: '',
            following_number: null,
            followers_number: null,
            is_followed: false,
            tweets_count: null,
        },
        allNotifications: {
            notifications_info: [],
            notifications_count: null
        },
        originalNotifications: [],
    }

export const FormErrorsDefaultValues =
    {
        username: [],
        email: [],
        password: [],
        password_confirmation: [],
        gender: [],
        birth_date: [],
        avatar: [],
        cover: [],
        display_name: [],
        bio: [],
    }