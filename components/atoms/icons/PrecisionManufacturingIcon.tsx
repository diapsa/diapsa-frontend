interface Props {
    className?: string
}

export function PrecisionManufacturingIcon({ className = "" }: Props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`inline-block ${className}`}
            aria-hidden="true"
        >
            <path d="M21 12a9 9 0 1 1-4.2-7.6" />
            <polyline points="21 3 21 9 15 9" />
        </svg>
    );



}
