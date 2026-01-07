import Image from "next/image";

export default function Logo() {
    return (
        <Image 
            src="/images/logo-diapsa.webp" 
            alt="Logo Diapsa" 
            width={180} 
            height={180} 
            className="h-auto w-auto max-h-10 object-contain"
            priority
        />
    );
}
