import { IBuilder } from "wj-config";
import Builder from "./Builder.js";

export * from "./Environment.js";
export default function wjConfig(): IBuilder {
    return new Builder();
}
