import { type Request, type Response } from 'express';
import { ProductSize, Product, type IProduct } from "../models/product.model.js";

export async function createProduct(req: Request, res: Response) {
    const {
        name,
        price,
        stock,
        category,
        size
    } = req.body;

    // Validate fields
    const errors: Record<string, string> = {};
    if(!name || typeof name !== "string" || !name.trim()) {
        errors.name = !name || !name.trim() ? "Missing name." : "Name must be a string.";
    }
    if(price === undefined || typeof price !== "number" || price < 0.01) {
        errors.price = price === undefined ? "Missing price." : "Invalid price.";
    }
    if(stock === undefined || !Number.isInteger(stock) || stock < 0) {
        errors.stock = stock === undefined ? "Missing stock quantity." : "Invalid stock quantity.";
    }
    if(!category || typeof category !== "string" || !category.trim()) {
        errors.category = !category || !category.trim() ? "Missing category.": "Category must be a string.";
    }
    if(!size || !Object.values(ProductSize).includes(size)) {
        errors.size = !size ? "Missing size." : "Invalid size.";
    }

    if(Object.keys(errors).length > 0) {
        return res.status(400).json({ message: "Validation failed", errors: errors });
    }

    try {
        // Check for duplicate, case-insensitive
        const existingProduct = await Product.findOne({ name: name, size: size })
                                             .collation({ locale: "en", strength: 2 })
                                             .lean();
        if(existingProduct) {
            return res.status(409).json({ message: "Product already exists." });
        }

        const product = await Product.create({
            name: name.trim(),
            price: price,
            stock: stock,
            category: category.trim(),
            size: size
        });

        return res.status(201).json(product);
    } catch(err) {
        console.error(err);

        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function getAllProducts(req: Request, res: Response) {

}

export async function getProduct(req: Request, res: Response) {

}

export async function updateProduct(req: Request, res: Response) {

}

export async function deleteProduct(req: Request, res: Response) {
    try {
        // _id is a string and not ObjectID, so no need to worry about CastError
        if(!await Product.findByIdAndDelete(req.params.id)) {
            return res.status(404).json({ message: "Product not found."});
        }

        return res.status(200).json({ message: "Product deleted successfully." });
    } catch(err) {
        console.error(err);

        return res.status(500).json({ message: "Internal server error." });
    }
}