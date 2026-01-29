import WipState from "@/components/molecules/wip/wipState";
import PageHeader from "@/components/organisms/PageHeader";

export default function PageIdap() {
    return (
        <main>
            <PageHeader title="IDAP" subtitle="Inspection Diagnostic and Assets Plataform" />
            <div className="bg-white">

                <WipState />
            </div>
        </main>
    )
}