import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";
import { userRoles } from "../../utils/systemConstants.js";

export const signup = {
  body: Joi.object({
    name: generalFields.name.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    phone: generalFields.phone.required(),
    role: generalFields.role.default(userRoles.User),
    DOB: Joi.date().max(new Date()),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};

export const login = {
  body: Joi.object({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};
