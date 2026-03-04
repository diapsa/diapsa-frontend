import { useEffect, useRef, useState } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

export default function Modal({ isOpen, onClose, children, className = "" }: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [animClass, setAnimClass] = useState("modal-opening");

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            setAnimClass("modal-opening");
            dialog.showModal();
        } else if (dialog.open) {
            setAnimClass("modal-closing");
        }
    }, [isOpen]);

    // Guard against animationend events bubbling up from child elements
    const handleAnimationEnd = (e: React.AnimationEvent<HTMLDialogElement>) => {
        if (e.target !== e.currentTarget) return;
        if (animClass === "modal-closing") {
            dialogRef.current?.close();
        }
    };

    // Fallback: if animationend never fires (e.g. animation interrupted), force-close after the animation duration
    useEffect(() => {
        if (animClass !== "modal-closing") return;
        const timer = setTimeout(() => {
            if (dialogRef.current?.open) dialogRef.current.close();
        }, 300);
        return () => clearTimeout(timer);
    }, [animClass]);

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            onAnimationEnd={handleAnimationEnd}
            className={`${animClass} relative m-auto rounded-xl shadow-2xl p-0 backdrop:bg-black/50 overflow-hidden open:flex open:flex-col ${className}`}
        >
            <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-4 text-gray-400 text-2xl p-2 rounded bg-gray-200 leading-none z-10 hover:text-white hover:bg-red-500"
                aria-label="Cerrar"
            >
                &times;
            </button>
            <div className="overflow-y-auto flex flex-col flex-1">
                {children}
            </div>
        </dialog>
    )
}