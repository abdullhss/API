import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const add = {
  body: Joi.object({
    code: Joi.string().lowercase().min(4).max(10).trim().required(),
    usages: Joi.number().positive().min(0).required(),
    limit: Joi.number().positive().min(0).required(),
    discountPercentage: Joi.number().positive().min(1).max(100).required(),
    expireDate: Joi.date()
      .min(new Date(new Date().getDate() + 1))
      .required(),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};

export const update = {
  body: Joi.object({
    code: Joi.string().lowercase().min(4).max(10).trim(),
    usages: Joi.number().positive().min(0),
    limit: Joi.number().positive().min(0),
    discountPercentage: Joi.number().positive().min(1).max(100),
    expireDate: Joi.date().min(new Date(new Date().getDate() + 1)),
  }).required(),
  params: Joi.object({
    _id: generalFields._id.required(),
  }).required(),
  query: Joi.object({}).required(),
};

export const code = {
  body: Joi.object({
    code: Joi.string().lowercase().min(4).max(10).trim().required(),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};
