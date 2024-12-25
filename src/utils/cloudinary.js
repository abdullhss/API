import dotenv from "dotenv";
dotenv.config();
//set directory dirname

import cloudinary from "cloudinary";

cloudinary.v2.config({
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  cloud_name: process.env.cloud_name,
});

export default cloudinary.v2;
