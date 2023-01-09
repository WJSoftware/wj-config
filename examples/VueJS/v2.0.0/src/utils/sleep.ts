import { RESOLVE_COMPONENT } from "@vue/compiler-core";

export default function sleep(duration: number) {
    return new Promise((rslv, _) => {
        setTimeout(() => {
            rslv(null);
        }, duration);
    })
};
