interface NumberedCardProps {
    number: string;
    label: string;
    description: string;
    variant?: "light" | "dark";
}

export default function NumberedCard({
    number,
    label,
    description,
    variant = "light",
}: NumberedCardProps) {
    if (variant === "dark") {
        return (
            <div className="relative overflow-hidden rounded-xl border border-primary/10 shadow-sm hover:shadow-lg transition-all group bg-primary">
                <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
                <div className="p-8 pl-10">
                    <div className="flex items-start gap-5">
                        <span className="text-5xl font-black text-secondary/30 group-hover:text-secondary/60 transition-colors leading-none shrink-0 select-none">
                            {number}
                        </span>
                        <div className="space-y-2 pt-1">
                            <p className="font-bold text-base text-white">{label}</p>
                            <p className="text-white/60 text-sm leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-8 border border-gray-100 border-t-4 border-t-secondary/30 hover:border-t-secondary shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start gap-5">
                <span className="text-5xl font-black text-secondary/30 group-hover:text-secondary/60 transition-colors leading-none select-none">
                    {number}
                </span>
                <div className="space-y-2 pt-1">
                    <p className="font-bold text-base text-primary">{label}</p>
                    <p className="text-tertiary text-sm leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    );
}
