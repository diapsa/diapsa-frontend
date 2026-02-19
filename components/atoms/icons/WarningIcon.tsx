interface Props {
    className?: string
}

export function WarningIcon({ className = "" }: Props) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`inline-block ${className}`}
            aria-hidden="true"
        >
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
    );
}
