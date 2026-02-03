

interface Props {
    className?: string
}
export function ChartIcon2({ className = "" }: Props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className={`inline-block ${className}`}>
            <rect x="15" y="60" width="15" height="30" fill="currentColor" rx="2" />
            <rect x="37.5" y="45" width="15" height="45" fill="currentColor" rx="2" />
            <rect x="60" y="25" width="15" height="65" fill="currentColor" rx="2" />
        </svg>
    );
}