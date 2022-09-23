import type { EnvironmentTest, IEnvironment, IEnvironmentDefinition, Traits } from "wj-config";
import { InvalidEnvNameError } from "./EnvConfigError.js";
import { EnvironmentDefinition } from "./EnvironmentDefinition.js";

function ensureEnvDefinition(env: string | IEnvironmentDefinition | (string | IEnvironmentDefinition)[]): IEnvironmentDefinition | IEnvironmentDefinition[] {
    if (typeof env === 'string') {
        return new EnvironmentDefinition(env);
    }
    else if (!Array.isArray(env)) {
        return env;
    }
    const result: IEnvironmentDefinition[] = [];
    env.forEach(e => {
        result.push(ensureEnvDefinition(e) as IEnvironmentDefinition);
    });
    return result;
}

/**
 * Environment class used to provide environment information throw the configuration object.
 */
export class Environment implements IEnvironment {
    /**
     * Default list of environment names.
     */
    static defaultNames: string[] = ['Development', 'PreProduction', 'Production'];

    readonly current: IEnvironmentDefinition;
    readonly all: IEnvironmentDefinition[];
    [x: string | 'current' | 'all' | 'hasTraits']: EnvironmentTest | IEnvironmentDefinition | IEnvironmentDefinition[] | ((traits: Traits) => boolean)

    /**
     * Initializes a new instance of this class.
     * @param value The current environment name.
     * @param names The list of known environment names.
     */
    constructor(value: string | IEnvironmentDefinition, names?: (string | IEnvironmentDefinition)[]) {
        this.all = ensureEnvDefinition(names ?? Environment.defaultNames) as IEnvironmentDefinition[];
        const currName = typeof value === 'string' ? value : value.name;
        let currEnv = null;
        this.all.forEach((envDef) => {
            (this as unknown as { [x: string]: () => boolean })[`is${envDef.name}`] = function () { return (this as unknown as Environment).current.name === envDef.name; };
            if (envDef.name === currName) {
                currEnv = envDef;
            }
        });
        // Throw if the current environment value was not found.
        if (!currEnv) {
            throw new InvalidEnvNameError(currName);
        }
        else {
            this.current = currEnv;
        }
    }

    hasTraits(traits: Traits): boolean {
        const hasBitwiseTraits = (t: number) => ((this.current.traits as number) & t) === t && t > 0;
        const hasStringTraits = (t: string[]) => {
            let has = true;
            t.forEach(it => {
                has = has && (this.current.traits as string[]).includes(it);
            });
            return has;
        };
        if (typeof traits === "number") {
            return hasBitwiseTraits(traits);
        }
        return hasStringTraits(traits);
    }
}
