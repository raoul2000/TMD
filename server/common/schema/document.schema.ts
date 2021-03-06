import joi from 'joi';
import validate from './validate';

const schema = joi.object().keys({
    'tags' : joi.array().items(joi.string())
});
// TODO: document validation include validating all tags assigned to this document

export default (o) => validate(schema, o);