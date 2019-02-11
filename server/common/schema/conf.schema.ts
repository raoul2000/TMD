import joi from 'joi';
import validate from './validate';

const schema = joi.object().keys({
    "port" : joi.number(),
    'param1': joi.string().required(),
    'basePath': joi.string().required()
});

export default (o) => validate(schema, o);