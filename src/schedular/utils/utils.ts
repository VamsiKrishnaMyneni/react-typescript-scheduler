function isValidDateInstance(date: Date): boolean {
    return !isNaN(date.getTime());
}

export function isValidDate(date: Date): boolean {
    return isValidDateInstance(date);
}