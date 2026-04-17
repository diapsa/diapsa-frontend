export function minutesToTimeString(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60

    return `${hours} ${hours > 1 ? "hr" : "hrs"} ${remainingMinutes} min`
}