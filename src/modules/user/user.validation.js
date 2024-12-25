import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";
import { userRoles } from "../../utils/systemConstants.js";

export const update = {
  body: Joi.object({
    name: generalFields.name,
    email: generalFields.email,
    password: generalFields.password,
    phone: generalFields.phone,
    role: generalFields.role.default(userRoles.User),
    DOB: Joi.date().max(new Date()),
  }).required(),
  params: Joi.object({}).required(),
  query: Joi.object({}).required(),
};
