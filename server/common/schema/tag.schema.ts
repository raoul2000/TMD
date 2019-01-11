import joi from 'joi';

const schema = joi.object().keys({
    'name': joi.string().required()
});

export default (o) => schema.validate(o);