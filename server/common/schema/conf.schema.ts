import joi from 'joi';
import validate from './validate';

const schema = joi.object().keys({
    'param1': joi.string().required()
});

export default (o) => validate(schema, o);