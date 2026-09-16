import mongoose, { type InferSchemaType } from "mongoose";
import crypto from "node:crypto";

const productSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => crypto.randomUUID()
        },
        name: {
            type: String,
            required: [true, "Product name is required."],
            trim: true
        },
        price: {
            type: Number,
            required: [true, "Product price is required."],
            min: [0.01, "Price must be greater than zero."]
        },
        stock: {
            type: Number,
            required: [true, "Available stock quantity is required."],
            min: [0, "Stock cannot be negative."],
            validate: {
                validator: Number.isInteger,
                message: "Stock must be a whole number."
            }
        },
        category: {
            type: String,
            required: [true, "Product category is required."],
            trim: true
        },
        size: {
            type: String,
            enum: ["XS", "S", "M", "L", "XL"],
            required: [true, "Product size is required."]
        }
    },
    {
        timestamps: true, // createdAt and updatedAt
        versionKey: false
    },
);

export type IProduct = InferSchemaType<typeof productSchema>;

export const Product = mongoose.model<IProduct>("Product", productSchema);