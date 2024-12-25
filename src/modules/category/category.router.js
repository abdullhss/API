import { Router } from "express";
import * as categoryController from "./category.controller.js";
import * as validator from "./category.validation.js";
import auth from "../../middleware/auth.js";
import categoryModel from "../../../DB/model/Category.model.js";
import { isNotExist } from "../../middleware/isNotExist.js";
import { isOwner } from "../../middleware/isOwner.js";
import { isExist } from "../../middleware/isExist.js";
import { fileUpload } from "../../utils/multer.js";
import {
  deleteImage,
  updateImage,
  uploadImage,
} from "../../middleware/uploadImage.js";
import { fileValidation, uniqueFields, userRoles } from "../../utils/systemConstants.js";
import { IdValidator, validation } from "../../middleware/validation.js";
import getAllData, { getDataById } from "../../middleware/getData.js";
const router = Router();
router
  .route("/")
  .get(getAllData())
  .post(
    auth([userRoles.Admin]),
    fileUpload(fileValidation.image).single("img"),
    validation(validator.add),
    isNotExist({ model: categoryModel, searchData: uniqueFields.name }),
    categoryController.add,
    uploadImage({model:categoryModel})
  );

router
  .route("/:_id")
  .get(validation(IdValidator), getDataById)
  .put(
    auth([userRoles.Admin]),
    fileUpload(fileValidation.image).single("img"),
    validation(validator.update),
    isExist({ model: categoryModel }),
    isOwner(categoryModel),
    isNotExist({ model: categoryModel, searchData: uniqueFields.name }),
    updateImage({model:categoryModel}),
    categoryController.update
  )
  .delete(
    auth([userRoles.Admin]),
    validation(IdValidator),
    isExist({ model: categoryModel }),
    isOwner(categoryModel),
    deleteImage(categoryModel),
    categoryController.remove
  );
export default router;
