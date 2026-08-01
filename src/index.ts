import { Builder } from "./builders/Builder.js";
import type { IBuilder } from "./types.js";

export * from "./buildEnvironment.js";
export * from "./EnvironmentDefinition.js";
export * from "./dataSources/index.js";
export type * from "./types.js";
export default function wjConfig(): IBuilder {
    return new Builder();
}
