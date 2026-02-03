'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FolletoDigitalPage() {
    const router = useRouter();

    useEffect(() => {
        // Abrir PDF en nueva pestaña
        const pdfWindow = window.open('/files/brochure.pdf', '_blank');

        // Si el navegador bloqueó el pop-up, redirigir directamente
        if (!pdfWindow || pdfWindow.closed || typeof pdfWindow.closed === 'undefined') {
            window.location.href = '/files/brochure.pdf';
        } else {
            // Si se abrió correctamente, redirigir al home
            router.push('/');
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg">Abriendo folleto digital...</p>
        </div>
    );
}