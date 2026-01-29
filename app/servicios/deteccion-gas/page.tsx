import WipState from "@/components/molecules/wip/wipState";
import PageHeader from "@/components/organisms/PageHeader";

export default function DeteccionGasPage() {
    return (
        <main>
            <PageHeader title="Deteccion de Gas" subtitle="" />
            <div className="bg-white">
                <WipState />

            </div>
        </main>
    )
}