import type { IEnvironmentDefinition, Traits } from "wj-config";

export class EnvironmentDefinition<TEnvironments extends string> implements IEnvironmentDefinition<TEnvironments> {
    public readonly name: TEnvironments;
    public readonly traits: Traits;

    constructor(name: TEnvironments, traits?: Traits) {
        this.name = name;
        this.traits = traits ?? 0;
    }
}
