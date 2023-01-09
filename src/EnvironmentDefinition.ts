import type { IEnvironmentDefinition, Traits } from "wj-config";

export class EnvironmentDefinition implements IEnvironmentDefinition {
    public readonly name: string;
    public readonly traits: Traits;

    constructor(name: string, traits?: Traits) {
        this.name = name;
        this.traits = traits ?? 0;
    }
}
