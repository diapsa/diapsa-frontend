interface Props {
    className?: string
}
export function CheckCircleIcon({ className = "" }: Props) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`inline-block ${className}`}
            aria-hidden="true"
        >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.59-3.3-3.3 1.42-1.42L11 13.76l4.88-4.88 1.42 1.42L11 16.59z" />
        </svg>
    );

}