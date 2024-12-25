import { Router } from "express";
import * as subcategoryContoller from "./subcategory.controller.js";
import * as validator from "./subcategory.validation.js";
import { isExist } from "../../middleware/isExist.js";
import categoryModel from "../../../DB/model/Category.model.js";
import {
  fileValidation,
  reqDataForms,
  uniqueFields,
  userRoles,
} from "../../utils/systemConstants.js";
import { isNotExist } from "../../middleware/isNotExist.js";
import subcategoryModel from "../../../DB/model/Subcategory.model.js";
import auth from "../../middleware/auth.js";
import {
  deleteImage,
  updateImage,
  uploadImage,
} from "../../middleware/uploadImage.js";
import { fileUpload } from "../../utils/multer.js";
import { isOwner } from "../../middleware/isOwner.js";
import { IdValidator, validation } from "../../middleware/validation.js";
import getAllData, { getDataById } from "../../middleware/getData.js";
const router = Router();

router.get("/", getAllData(uniqueFields.categoryId));
router.get(
  "/category/:_id",
  isExist({
    model: categoryModel,
    dataFrom: reqDataForms.parmas,
    searchData: uniqueFields.id,
  }),
  subcategoryContoller.getCategorySubcategory
);
router.post(
  "/:categoryId",
  auth([userRoles.Admin]),
  fileUpload(fileValidation.image).single("img"),
  validation(validator.add),
  isExist({ model: categoryModel, searchData: uniqueFields.categoryId }),
  isNotExist({ model: subcategoryModel, searchData: uniqueFields.name }),
  subcategoryContoller.add,
  uploadImage({ model: subcategoryModel })
);

router
  .route("/:_id")
  .put(
    auth([userRoles.Admin]),
    fileUpload(fileValidation.image).single("img"),
    validation(validator.update),
    isExist({ model: subcategoryModel }),
    isNotExist({ model: subcategoryModel, searchData: uniqueFields.name }),
    updateImage({ model: subcategoryModel }),
    subcategoryContoller.update
  )
  .delete(
    auth([userRoles.Admin]),
    validation(IdValidator),
    isExist({ model: subcategoryModel }),
    isOwner(subcategoryModel),
    deleteImage(subcategoryModel),
    subcategoryContoller.remove
  )
  .get(validation(IdValidator), getDataById);

export default router;
