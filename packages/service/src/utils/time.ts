export const timeTextToSecond = (timeText: string) => {
    switch (timeText) {
        case '7d':
            return 7 * 24 * 60 * 60;
        default:
            return `${timeText}`;
    }

}