const stats = [
    { value: "22+", label: "Años de experiencia" },
    { value: "500+", label: "Activos monitoreados" },
    { value: "95%", label: "Reducción de falsas alarmas" },
    { value: "24/7", label: "Monitoreo continuo" },
];

export default function ContinuosMonitoringStats() {
    return (
        <section className="bg-primary py-12 border-y-4 border-secondary">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-4xl lg:text-5xl font-black text-secondary">
                                {stat.value}
                            </p>
                            <p className="text-white/70 text-sm mt-1 tracking-wide">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
