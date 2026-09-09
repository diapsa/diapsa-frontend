import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Folleto Digital",
    description: "Descubre nuestros servicios de mantenimiento predictivo, productos especializados y capacitación profesional.",
    robots: {
        index: false, // Redirect page, no index
    },
};

export default function FolletoDigitalPage() {
    // Server-side redirect to PDF
    redirect('/files/brochure.pdf');
}
