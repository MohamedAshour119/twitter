interface Props {
    styles: string
}
export default function Skeleton({styles}: Props) {
    return (
        <div className={`${styles} bg-[#24272b] animate-pulse rounded-full`}></div>
    )
}
