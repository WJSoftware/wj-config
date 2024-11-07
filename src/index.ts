import { Builder } from "./builders/Builder.js";
import { type IBuilder } from "./wj-config.js";

export * from "./buildEnvironment.js";
export * from "./EnvironmentDefinition.js";
export type * from "./wj-config.js";
export default function wjConfig(): IBuilder {
    return new Builder();
}
