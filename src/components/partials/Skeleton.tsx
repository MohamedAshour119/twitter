interface Props {
    styles: string
}
export default function Skeleton({styles}: Props) {
    return (
        <div className={`${styles} bg-[#2a2d32b3] animate-pulse rounded-full`}></div>
    )
}
