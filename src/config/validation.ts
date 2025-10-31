import Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(8).required(),
  N8N_WEBHOOK_URL: Joi.string().uri().optional(),
}).unknown();
