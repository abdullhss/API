import * as mongo from 'mongoose'

const CouponSchema = new mongo.Schema(
    {
        code: {
            type: String,
            uniqe: [true, "code must be unique"],
            required: [true, "code is required"],
            lowercase:true,
            trim:true
        },
        // usages of the coupon
        usages: {
            type: Number,
            required: [true, "usages is required"],
            min: [0, "usages must be >= 0"],
        },
        // limit of each user
        limit: {
            type: Number,
            required: [true, "limit is required"],
            min: [0, "limit must be >= 0"],
        },
        // usages of each user
        users: {
            type: Object,
            default: new Object(),
        },
        discountPercentage: {
            type: Number,
            required: [true, "discountPercentage is required"],
            min: [0, "discountPercentage must be >= 0 and <= 100"],
            max: [100, "discountPercentage must be >= 0 and <= 100"],
        },
        expireDate: {
            type: Date,
            required: [true, "expireDate is required"],
        },
        createdBy: {
            type: mongo.Types.ObjectId,
            ref: "User",
            required: [true, "createdBy is required"],
        },
    },
    {
        timestamps: true,
    }
);

const couponModel = mongo.model("Coupon", CouponSchema);
export default couponModel