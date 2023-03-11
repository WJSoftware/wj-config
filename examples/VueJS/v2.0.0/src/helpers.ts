export type Debouncer = { cancel: () => void };
export function debounce(fn: TimerHandler, timeout: number): Debouncer {
    const timerId = setTimeout(fn, timeout);
    return {
        cancel() {
            clearTimeout(timerId);
        }
    }
};
