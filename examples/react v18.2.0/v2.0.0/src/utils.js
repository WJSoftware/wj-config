export function suspenderWrapper(promise) {
    let isPending = true;
    let outcome = null;
    const suspender = promise.then(
        (r) => {
            outcome = r;
            isPending = false;
        },
        (e) => {
            outcome = e;
            isPending = false;
        }
    );
    return () => {
        if (isPending) {
            throw suspender;
        }
        return outcome;
    };
}
