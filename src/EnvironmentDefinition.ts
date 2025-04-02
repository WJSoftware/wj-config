import type { IEnvironmentDefinition, Traits } from "./wj-config.js";

/**
 * Environment definition class used to specify the current environment as an object.
 */
export class EnvironmentDefinition<TEnvironment extends string> implements IEnvironmentDefinition<TEnvironment> {
    /**
     * Gets the environment's name.
     */
    public readonly name: TEnvironment;
    /**
     * Gets the environment's assigned traits.
     */
    public readonly traits: Traits;

    /**
     * Initializes a new instance of this class.
     * @param name The name of the current environment.
     * @param traits The traits assigned to the current environment.
     */
    constructor(name: TEnvironment, traits?: Traits) {
        this.name = name;
        this.traits = traits ?? 0;
    }
}
