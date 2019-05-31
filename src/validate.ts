import * as ajv from 'ajv';
// import {Ajv} from 'ajv';

// const ajv = require('ajv');
const Ajv = ajv.default;

interface ValidResult<T> {
    isValid: true;
    typesafeObject: T;
};

interface InvalidResult<T> {
    isValid: false;
    errors: any[];
};

type ValidationResult<T> = ValidResult<T> | InvalidResult<T>;

export default class Validator<T extends {}> {
    private jsonSchema: {};
    private validator?: ajv.ValidateFunction;
    internalCompileValidator = () => {

        this.validator = new Ajv({ allErrors: true })
            .compile(this.jsonSchema);
    }


    constructor(jsonSchema?: {}) {
        if(typeof jsonSchema === 'undefined') throw new Error('ayo there\'s no jsonSchema here ');

        this.jsonSchema = jsonSchema;
    }

    validate = (objectToValidate: {}): ValidationResult<T> => {
        console.log(this.jsonSchema);

        if(typeof this.validator === 'undefined') throw new Error();

        this.validator(objectToValidate);

        const errors = this.validator.errors || [];

        const isValid = (errors.length === 0);

        if (!isValid) {
            return {
                isValid: false,
                errors,
            }
        }

        // jsonSchemaValidator(validationTarget);
        // const output = {
        //     source: validationTarget,
        //     errors: jsonSchemaValidator.errors || [],
        // }
        return {
            isValid: true,
            typesafeObject: objectToValidate as T,
        };
    }
}
