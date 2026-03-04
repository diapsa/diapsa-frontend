'use client';
import { useState } from "react";
import PageHeader from "@/components/organisms/PageHeader";
import LdarServiceCards from "@/components/organisms/LdarServiceCards";
import WhatAksPPCIEM from "@/components/organisms/WhatAskPPCIEM";
import ContactFormGasDetection from "@/components/organisms/ContactFormGasDetection";
import GasDetectionHero from "@/components/organisms/GasDetectionHero";
import GasDetectionChallenges from "@/components/organisms/GasDetectionChallenges";
import GasDetectionSolution from "@/components/organisms/GasDetectionSolution";
import GasDetectionTechnology from "@/components/organisms/GasDetectionTechnology";

export default function DeteccionGasPage() {
    const [openModal, setOpenModal] = useState(false);

    return (
        <main>
            <ContactFormGasDetection isOpen={openModal} onClose={() => setOpenModal(false)} />
            <PageHeader title="Deteccion de Gas" />

            <div className="bg-white font-display">
                <GasDetectionHero onOpenModal={() => setOpenModal(true)} />
                <GasDetectionChallenges />
                <WhatAksPPCIEM />
                <LdarServiceCards />
                <GasDetectionSolution />
                <GasDetectionTechnology onOpenModal={() => setOpenModal(true)} />
            </div>
        </main>
    );
}
