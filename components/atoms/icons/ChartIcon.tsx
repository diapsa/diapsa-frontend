interface Props {
    className?: string
}
export default function ChartIcon({ className = "" }: Props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className={`inline-block ${className}`}>
            <path
                d="M 5 50 L 25 50 L 35 20 L 45 80 L 55 50 L 65 50 L 95 50"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
}