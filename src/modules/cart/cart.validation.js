import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const add = {
  body: Joi.object({
    quantity: Joi.number().min(1).required(),
  }).required(),
  params: Joi.object({
    productId: generalFields._id.required(),
  }).required(),
  query: Joi.object({}).required(),
};
export const update = {
  body: Joi.object({
    quantity: Joi.number().min(1).required(),
  }).required(),
  params: Joi.object({
    productId: generalFields._id.required(),
  }).required(),
  query: Joi.object({}).required(),
};

export const remove = {
  body: Joi.object({}).required(),
  params: Joi.object({
    productId: generalFields._id.required(),
  }).required(),
  query: Joi.object({}).required(),
};
