import type { EnvironmentTest, IEnvironment, IEnvironmentDefinition, Trait, Traits } from "wj-config";
import { InvalidEnvNameError } from "./EnvConfigError.js";
import { EnvironmentDefinition } from "./EnvironmentDefinition.js";
import { isArray } from "./helpers.js";

function ensureEnvDefinition(env: string | IEnvironmentDefinition): IEnvironmentDefinition {
    if (typeof env === 'string') {
        return new EnvironmentDefinition(env);
    }
    return env;
}

export class Environment implements IEnvironment {
    /**
     * Default list of environment names.
     */
    static defaultNames: string[] = ['Development', 'PreProduction', 'Production'];

    readonly current: IEnvironmentDefinition;
    readonly all: string[];
    [x: string | 'current' | 'all' | 'hasTraits' | 'hasAnyTrait']: EnvironmentTest | IEnvironmentDefinition | string[] | ((traits: Traits) => boolean)

    constructor(currentEnvironment: string | IEnvironmentDefinition, possibleEnvironments?: string[]) {
        this.all = possibleEnvironments ?? Environment.defaultNames;
        this.current = ensureEnvDefinition(currentEnvironment);
        let validCurrentEnvironment = false;
        this.all.forEach((envName) => {
            (this as unknown as { [x: string]: () => boolean })[`is${envName}`] = function () { return (this as unknown as Environment).current.name === envName; };
            validCurrentEnvironment = validCurrentEnvironment || this.current.name === envName;
        });
        // Throw if the current environment name was not found among the possible environment names..
        if (!validCurrentEnvironment) {
            throw new InvalidEnvNameError(this.current.name);
        }
    }

    #normalizeTestTraits(traits: Trait | Traits): Trait | Traits {
        if (typeof traits === 'number' && typeof this.current.traits !== 'number') {
            throw new TypeError('Cannot test a numeric trait against string traits.');
        }
        if ((typeof traits === 'string' || (isArray(traits) && typeof traits[0] === 'string')) && typeof this.current.traits === 'number') {
            throw new TypeError('Cannot test string traits against a numeric trait.');
        }
        if (typeof traits === 'string') {
            traits = [traits];
        }
        return traits;
    }

    hasTraits(traits: Trait | Traits): boolean {
        traits = this.#normalizeTestTraits(traits);
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
        return hasStringTraits(traits as string[]);
    }

    hasAnyTrait(traits: Trait | Traits): boolean {
        traits = this.#normalizeTestTraits(traits);
        const hasAnyBitwiseTrait = (t: number) => ((this.current.traits as number) & t) > 0;
        const hasAnyStringTrait = (t: string[]) => {
            for (let x of t) {
                if ((this.current.traits as string[]).includes(x)) {
                    return true;
                }
            }
            return false;
        };
        if (typeof traits === "number") {
            return hasAnyBitwiseTrait(traits);
        }
        return hasAnyStringTrait(traits as string[]);
    }
}
