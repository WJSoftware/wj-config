import { configure, ConsoleSink } from "structured-log";
import config from "../config.js";

const sink = new ConsoleSink({
    includeTimestamps: true
});

function normalizeNamespace(ns) {
    return ns ? `${config.logging.rootNamespace}.${ns}` : config.logging.rootNamespace;
}

export default function logFactory(namespace) {
    return configure()
        .minLevel(config.logging.minLevel)
        .enrich({
            Namespace: normalizeNamespace(namespace)
        })
        .writeTo(sink)
        .create();
}