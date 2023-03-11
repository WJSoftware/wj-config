export default Object.freeze({
    None: 0x0,
    Production: 0x1,
    VerboseLogging: 0x2,
    PremiumCustomer: 0x4,
    toString: function (value: number) {
        let result = [];
        let zero = '';
        for (const [k, v] of Object.entries(this)) {
            if (v === 0) {
                zero = k;
                continue;
            }
            if (typeof v === 'function') {
                continue;
            }
            if (isNaN(v)) {
                continue;
            }
            if ((value & v) === v) {
                result.push(k);
            }
        }
        if (result.length > 0) {
            return result.join(', ');
        }
        return zero;
    }
});
