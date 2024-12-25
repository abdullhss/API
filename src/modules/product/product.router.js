import { Router } from "express";
import auth from "../../middleware/auth.js";
import { isNotExist } from "../../middleware/isNotExist.js";
import productModel from "../../../DB/model/Product.model.js";
import * as productController from "./controller/product.js";
import { isExist } from "../../middleware/isExist.js";
import { isOwner } from "../../middleware/isOwner.js";
import {
  fileValidation,
  reqDataForms,
  uniqueFields,
  userRoles,
} from "../../utils/systemConstants.js";
import brandModel from "../../../DB/model/Brand.model.js";
import { fileUpload } from "../../utils/multer.js";
import {
  deleteImage,
  updateImage,
  uploadImage,
} from "../../middleware/uploadImage.js";
import { IdValidator, validation } from "../../middleware/validation.js";
import getAllData, { getDataById } from "../../middleware/getData.js";
import categoryModel from "../../../DB/model/Category.model.js";

const router = Router();
router.get("/getUserProducts", auth(), productController.getUserProducts);
router
  .route("/")
  .post(
    auth(),
    fileUpload(fileValidation.image).fields([
      { name: "images", maxCount: 5 },
      { name: "imageCover", maxCount: 1 },
    ]),

    // isExist({
    //   model: subcategoryModel,
    //   dataFrom: reqDataForms.body,
    //   searchData: uniqueFields.subcategoryId,
    // }),
    // isExist({
    //   model: brandModel,
    //   dataFrom: reqDataForms.body,
    //   searchData: uniqueFields.brandId,
    // }),
    isExist({
      model: categoryModel,
      dataFrom: reqDataForms.body,
      searchData: uniqueFields.category,
    }),
    isNotExist({ model: productModel, searchData: uniqueFields.name }),
    productController.addProduct,
    uploadImage({ model: productModel, isFields: true })
  )
  .get(auth(), productController.getAllProducts);

router
  .route("/:_id")
  .get(validation(IdValidator), productController.getProduct)
  .delete(
    auth(),
    validation(IdValidator),
    isExist({ model: productModel }),
    isOwner(productModel),
    deleteImage(productModel, true),
    productController.removeProduct
  )
  .put(
    auth(),
    fileUpload(fileValidation.image).fields([
      { name: "images", maxCount: 5 },
      { name: "imageCover", maxCount: 1 },
    ]),
    // validation(validator.update),
    isExist({ model: productModel }),
    isOwner(productModel),
    isNotExist({ model: productModel, searchData: uniqueFields.name }),
    updateImage({ model: productModel, isFields: true }),
    productController.updateProduct
  );

export default router;
