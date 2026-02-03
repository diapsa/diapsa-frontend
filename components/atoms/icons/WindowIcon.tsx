interface Props {
    className?: string
}
export function WindowIcon({ className = "" }: Props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className={`inline-block ${className}`}>
            <rect x="10" y="10" width="35" height="35" stroke="currentColor" strokeWidth="4" fill="none" rx="2" />
            <rect x="55" y="10" width="35" height="35" stroke="currentColor" strokeWidth="4" fill="none" rx="2" />
            <rect x="10" y="55" width="35" height="35" stroke="currentColor" strokeWidth="4" fill="none" rx="2" />
            <rect x="55" y="55" width="35" height="35" stroke="currentColor" strokeWidth="4" fill="none" rx="2" />
        </svg>
    );
}