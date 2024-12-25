import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const add = {
  body: Joi.object({
    name: generalFields.name.required(),
    description: Joi.string().min(5).max(1000).required(),
    price: Joi.number().positive().required(),
    subcategoryId: generalFields._id.required(),
    stock: Joi.number().positive().default(1).required(),
    brandId: generalFields._id.required(),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
  file: generalFields.file.required(),
};

export const update = {
  body: Joi.object({
    name: generalFields.name,
    description: Joi.string().min(5).max(1000),
    price: Joi.number().positive(),
    stock: Joi.number().positive().default(1),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
  file: generalFields.file,
};
