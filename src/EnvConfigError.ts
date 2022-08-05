/**
 * Error class used to raise an error whenever an environment object is being created with an environment value that 
 * does not exist in the list of known environment names.
 */
export class InvalidEnvNameError extends Error {
    /**
     * Environment value that caused the error.
     */
    public readonly value: string;

    constructor(value: string, message?: string) {
        super(message ?? `The provided environment value "${value}" was not found among the provided list of environments.`);
        this.value = value;
    }
};
