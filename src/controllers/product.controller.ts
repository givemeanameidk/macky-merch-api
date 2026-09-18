import { type Request, type Response } from 'express';
import { ProductSize, Product, type IProduct } from "../models/product.model.js";

export async function createProduct(req: Request, res: Response) {
    const {
        name,
        price,
        stock,
        category,
        size,
        description
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
    if(description === null || (description && typeof category !== "string")) { // value for description can be ""
        errors.description = description === null ? "Description cannot be null." : "Description must be a string.";
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
            size: size,
            description: description
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
    try {
        const product = await Product.findById(req.params.id).lean();
        if(!product) {
            return res.status(404).json({ message: "Product does not exist." })
        }

        return res.status(200).json(product);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function updateProduct(req: Request, res: Response) {
    const {
        name,
        price,
        stock,
        category,
        size,
        description
    } = req.body;

    const errors: Record<string, string> = {};

    // Only validate fields if they are included in the request body
    if(name !== undefined) {
        if(typeof name !== "string" || !name.trim()) {
            errors.name = "Name must be a a non-empty string.";
        }
    }
    if(price !== undefined) {
        if(typeof price !== "number" || price < 0.01) {
            errors.price = "Price must be a positive number.";
        }
    }
    if(stock !== undefined) {
        if(!Number.isInteger(stock) || stock < 0) {
            errors.stock = "Stock must be a non-negative integer.";
        }
    }
    if(category !== undefined) {
        if(typeof category !== "string" || !category.trim()) {
            errors.category = "Category must be a non-empty string.";
        }
    }
    if(size !== undefined) {
        if(!Object.values(ProductSize).includes(size)) {
            errors.size = "Invalid size.";
        }
    }
    if(description !== undefined) {
        if(description === null || typeof description !== "string") {
            errors.description = description === null ? "Description cannot be null." : "Description must be a string.";
        }
    }

    if(Object.keys(errors).length > 0) {
        return res.status(400).json({ message: "Validation failed", errors: errors });
    }

    try {
        // Build the update object with trimmed strings
        const updateData: Record<string, any> = {};
        if(name !== undefined) updateData.name = name.trim();
        if(price !== undefined) updateData.price = price;
        if(stock !== undefined) updateData.stock = stock;
        if(category !== undefined) updateData.category = category.trim();
        if(size !== undefined) updateData.size = size;
        if(description !== undefined) updateData.description = description.trim();

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).lean();

        if(!updatedProduct) {
            return res.status(404).json({ message: "Product not found." });
        }

        return res.status(200).json(updatedProduct);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function deleteProduct(req: Request, res: Response) {
    try {
        // _id is a string and not ObjectID, so no need to worry about CastError
        if(!await Product.findByIdAndDelete(req.params.id).lean()) {
            return res.status(404).json({ message: "Product does not exist."});
        }

        return res.status(200).json({ message: "Product deleted successfully." });
    } catch(err) {
        console.error(err);

        return res.status(500).json({ message: "Internal server error." });
    }
}