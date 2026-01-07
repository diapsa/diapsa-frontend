import PageHeader from "@/components/organisms/PageHeader";
import WipState from "@/components/molecules/wip/wipState";
import Image from "next/image";

export default function AcercaDePage() {
  return (
    <div>
      <PageHeader
        title="ACERCA DE DIAPSA"
        subtitle="Más de 22 años de experiencia en mantenimiento predictivo industrial"
      />

      <section className="w-full bg-white py-16 lg:py-24">
        <WipState />
      </section>
    </div>
  );
}
