import type { IEnvironment } from "wj-config";
import { InvalidEnvNameError } from "./EnvConfigError.js";

/**
 * Environment class used to provide environment information throw the configuration object.
 */
export class Environment implements IEnvironment {
    /**
     * Default list of environment names.
     */
    static defaultNames: string[] = ['Development', 'PreProduction', 'Production'];

    readonly value: string;
    readonly names: string[];
    [x: string]: (() => boolean) | string | string[];

    /**
     * Initializes a new instance of this class.
     * @param value The current environment name.
     * @param names The list of known environment names.
     */
    constructor(value: string, names?: string[]) {
        this.value = value;
        this.names = names ?? Environment.defaultNames;
        let currEnvFound = false;
        this.names.forEach((name) => {
            (this as unknown as { [x: string]: () => boolean })[`is${name}`] = function () { return (this as unknown as Environment).value === name; };
            currEnvFound = currEnvFound || name === value;
        });
        // Throw if the current environment value was not found.
        if (!currEnvFound) {
            throw new InvalidEnvNameError(value);
        }
    }
}
