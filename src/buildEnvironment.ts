import { InvalidEnvNameError } from "./EnvConfigError.js";
import { EnvironmentDefinition } from "./EnvironmentDefinition.js";
import { isArray } from "./helpers.js";
import type { EnvironmentTestFn, IEnvironment, IEnvironmentDefinition, Trait, Traits } from "./wj-config.js";

function ensureEnvDefinition<TEnvironments extends string>(env: string | IEnvironmentDefinition<TEnvironments>): IEnvironmentDefinition<TEnvironments> {
    if (typeof env === 'string') {
        return new EnvironmentDefinition(env) as IEnvironmentDefinition<TEnvironments>;
    }
    return env;
}

function capitalize(text: string) {
    return text[0].toLocaleUpperCase() + text.slice(1);
}

/**
 * Builds an environment object with the provided environment information.
 * @param currentEnvironment The application's current environment.
 * @param possibleEnvironments The complete list of all possible environments.
 * @returns The newly created `IEnvironment<TEnvironments>` object.
 */
export function buildEnvironment<TEnvironment extends string>(
    possibleEnvironments: readonly TEnvironment[],
    currentEnvironment: TEnvironment | IEnvironmentDefinition<TEnvironment>,
): IEnvironment<TEnvironment> {
    const envDef = ensureEnvDefinition(currentEnvironment);
    const env = {
        get all() {
            return possibleEnvironments;
        },
        get current() {
            return envDef;
        }
    } as IEnvironment<TEnvironment>;
    env.hasAnyTrait = hasAnyTrait.bind(env);
    env.hasTraits = hasTraits.bind(env);
    let validCurrentEnvironment = false;
    env.all.forEach((envName) => {
        (env as Record<string, EnvironmentTestFn>)[`is${capitalize(envName)}`] = function () {
            return env.current.name === envName;
        };
        validCurrentEnvironment = validCurrentEnvironment || env.current.name === envName;
    });
    // Throw if the current environment name was not found among the possible environment names..
    if (!validCurrentEnvironment) {
        throw new InvalidEnvNameError(env.current.name);
    }
    return env;

    function normalizeTestTraits(this: IEnvironment<TEnvironment>, traits: Trait | Traits): Trait | Traits {
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

    function hasTraits(this: IEnvironment<TEnvironment>, traits: Trait | Traits): boolean {
        traits = normalizeTestTraits.call(this, traits);
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

    function hasAnyTrait(this: IEnvironment<TEnvironment>, traits: Trait | Traits): boolean {
        traits = normalizeTestTraits.call(this, traits);
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
