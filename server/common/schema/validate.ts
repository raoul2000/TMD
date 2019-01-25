import joi from 'joi';

const validate = (schema: joi.ObjectSchema, o: any | Array<any>) : Array<joi.ValidationResult<any>> => {
    if( Array.isArray(o)) {
        return o.map( (item) => schema.validate(item));
    } else {
        return [schema.validate(o)];
    }
};

export default validate;

export const getValidationErrors = (validationResult: any): any[] => {    
    return validationResult.filter( validation => validation.error !== null); 
};
