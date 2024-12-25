import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const add = {
  body: Joi.object({
    name: generalFields.name.required(),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
  file: generalFields.file,
};

export const update = {
  body: Joi.object({
    name: generalFields.name,
  }).required(),
  params: Joi.object({
    _id: generalFields._id,
  }).required(),
  query: Joi.object({}).required(),
  file: generalFields.file,
};

