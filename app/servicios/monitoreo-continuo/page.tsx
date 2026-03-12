import PageHeader from "@/components/organisms/PageHeader";
import ContactForm from "@/components/organisms/ContactForm";
import ContinuosMonitoringValueProp from "@/components/organisms/ContinuosMonitoringValueProp";
import ContinuosMonitoringStats from "@/components/organisms/ContinuosMonitoringStats";
import ContinuosMonitoringChallenge from "@/components/organisms/ContinuosMonitoringChallenge";
import ContinuosMonitoringSolutions from "@/components/organisms/ContinuosMonitoringSolutions";
import ContinuosMonitoringCta from "@/components/organisms/ContinuosMonitoringCta";

export default function ContinuosMonitoringPage() {
    return (
        <main>
            <PageHeader
                title="Monitoreo Continuo"
                subtitle="Transformamos señales en decisiones, decisiones en resultados"
                breadcrumbs={[
                    { label: "Inicio", link: "/" },
                    { label: "Servicios", link: "/servicios" },
                    { label: "Monitoreo Continuo", link: "/servicios/monitoreo-continuo" },
                ]}
            />
            <ContinuosMonitoringValueProp />
            <ContinuosMonitoringStats />
            <ContinuosMonitoringChallenge />
            <ContinuosMonitoringSolutions />
            <ContinuosMonitoringCta />
            <section id="contacto">
                <ContactForm />
            </section>
        </main>
    );
}
