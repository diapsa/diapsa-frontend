export function ThermometerIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 14.76V3.5C14 2.67 13.33 2 12.5 2C11.67 2 11 2.67 11 3.5V14.76C10.36 15.24 10 15.98 10 16.75C10 18.27 11.23 19.5 12.75 19.5C14.27 19.5 15.5 18.27 15.5 16.75C15.5 15.98 15.14 15.24 14.5 14.76H14Z" fill="currentColor" />
            <path d="M12 14C12.5523 14 13 13.5523 13 13V6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V13C11 13.5523 11.4477 14 12 14Z" fill="currentColor" />
        </svg>
    );
}