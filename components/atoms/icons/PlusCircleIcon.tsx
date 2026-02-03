interface Props {
    className?: string
}
export function PlusCircleIcon({ className = "" }: Props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className={`inline-block ${className}`}>
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" />
            <rect x="40" y="20" width="20" height="60" fill="currentColor" />
            <rect x="20" y="40" width="60" height="20" fill="currentColor" />
        </svg>
    );
}