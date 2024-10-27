import { IBuilder } from "wj-config";
import { Builder } from "./Builder.js";

export * from "./DataSource.js";
export * from "./Environment.js";
export * from "./EnvironmentDefinition.js";
export default function wjConfig(): IBuilder {
    return new Builder();
}
