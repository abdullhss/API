import connection from "mongoose";
import { config } from "dotenv";
config();
const connect = await connection
  .connect(process.env.DB_ATLAS)
  .then(() => console.log("DB CONNECIED"))
  .catch((err) => console.log(`DB FAILED ${err}`));
export default connect;
