interface Props {
    className?: string
}
export default function DoubleCircleIcon({ className = "" }: Props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className={`inline-block ${className}`}>
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" />
            <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="30" />

        </svg>
    );
}