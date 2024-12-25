import cloudinary from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/errorHandling.js";

export const uploadImage = ({ model, isArray = false, isFields = false }) => {
  return asyncHandler(async (req, res, next) => {
    const modelName = model.modelName.toLowerCase();
    if (req.file || req.files?.length || Object.keys(req.files || {}).length) {
      if (isArray) {
        const images = [];

        for (const image of req.files) {
          // upload images to cloud service
          const { public_id, secure_url } = await cloudinary.uploader.upload(
            image.path,
            {
              folder: `HCI-project/${modelName}/${req[modelName]._id}`,
            }
          );

          images.push({
            public_id,
            secure_url,
          });
        }
        req[modelName].images = images;
      } else if (isFields) {
        const fields = Object.keys(req.files); // ["images","imageCover"]

        for (const field of fields) {
          req[modelName][field] = [];
          for (const obj of req.files[field]) {
            // upload new imgs
            const { public_id, secure_url } = await cloudinary.uploader.upload(
              obj.path,
              {
                folder: `HCI-project/${modelName}/${req[modelName]._id}/${field}`,
              }
            );

            req[modelName][field].push({ public_id, secure_url });
          }
        }
        if (Object.keys(req.files).includes("imageCover"))
          req[modelName].imageCover = req[modelName].imageCover[0];
      } else {
        const { public_id, secure_url } = await cloudinary.uploader.upload(
          req.file.path,
          {
            folder: `HCI-project/${modelName}/${req[modelName]._id}`,
          }
        );

        req[modelName].image = {
          public_id,
          secure_url,
        };
      }
      // save image paths to DB
      await req[modelName].save();
    }

    return res.status(200).json({ message: "success", model: req[modelName] });
  });
};

export const updateImage = ({ model, isArray = false, isFields = false }) => {
  return asyncHandler(async (req, res, next) => {
    // check if file is send
    if (!(req.file || req.files?.length)) return next();

    const modelName = model.modelName.toLowerCase();
    const modelData = req[modelName];

    // check if it one file or more
    if (isArray) {
      // delete the pervious images
      if (modelData.images.length) {
        await cloudinary.api.delete_resources_by_prefix(
          `HCI-project/${modelName}/${modelData._id}`
        );
      }

      const images = [];

      // upload new imgs
      for (const image of req.files) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(
          image.path,
          {
            folder: `HCI-project/${modelName}/${modelData._id}`,
          }
        );

        images.push({ public_id, secure_url });
      }

      req.body.images = images;
    } else if (isFields) {
      const fields = Object.keys(req.files); // ["images","imageCover"]

      for (const field of fields) {
        req.body[field] = [];
        for (const obj of req.files[field]) {
          // delete the pervious images
          if (modelData[field].length) {
            await cloudinary.api.delete_resources_by_prefix(
              `HCI-project/${modelName}/${modelData._id}/${field}`
            );
          }

          // upload new imgs
          const { public_id, secure_url } = await cloudinary.uploader.upload(
            obj.path,
            {
              folder: `HCI-project/${modelName}/${modelData._id}/${field}`,
            }
          );

          req.body[field].push({ public_id, secure_url });
        }
      }
      if (req.files.imageCover) req.body.imageCover = req.body.imageCover[0];
    } else {
      //delete pervious img
      if (modelData.image)
        await cloudinary.uploader.destroy(modelData.image.public_id);

      // upload new img
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: `HCI-project/${modelName}/${modelData._id}`,
        }
      );

      req.body.image = { public_id, secure_url };
    }
    return next();
  });
};

export const deleteImage = (model, isArray = false) => {
  return asyncHandler(async (req, res, next) => {
    const modelName = model.modelName.toLowerCase();
    const modelData = req[modelName];

    // if the model doesn't have image
    if (!(modelData.image || modelData.images || modelData.imageCover))
      return next();

    if (isArray) {
      await cloudinary.api.delete_resources_by_prefix(
        `HCI-project/${modelName}/${modelData._id}`
      );
      modelData.images = [];
      await modelData.save();
    } else if (isFields) {
    } else {
      await cloudinary.uploader.destroy(modelData.image.public_id);
      await modelData.updateOne({
        $unset: { image: "" },
      });
    }

    return next();
  });
};
