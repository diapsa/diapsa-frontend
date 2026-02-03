export interface CasoExito {
    slug: string;
    title: string;
    client: string;
    industry: string;
    service: string;
    seo: {
        title: string;
        description: string;
    };
    introduction: string;
    challenge: string;
    methodology: {
        name: string;
        stages: Array<{
            stage: string;
            title: string;
            description: string;
        }>;
    };
    results: string;
    metrics?: Record<string, number | string>;
    economicImpact: string;
    conclusion: string;
}
