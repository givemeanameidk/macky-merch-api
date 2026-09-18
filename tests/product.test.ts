import { describe, it, expect, vi, afterEach } from "vitest";
import request from "supertest";
import { app } from "../server.js";
import { Product } from "../src/models/product.model.js";

vi.mock("../src/models/product.model");

describe("Product API", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("should return 400 when creating a product with missing fields", async () => {
        const res = await request(app).post("/api/products").send({
            name: "Incomplete Shirt"
        });
        
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Validation failed.");
        expect(res.body.errors).toHaveProperty("price");
        expect(res.body.errors).toHaveProperty("category");
    });

    it("should create a product when provided with complete valid attributes (201 Created)", async () => {
        const validProductPayload = {
            name: "LSCS Hoodie",
            price: 49.99,
            stock: 50,
            category: "Apparel",
            size: "L",
            description: "Warm cotton hoodie."
        };

        const mockSavedProduct = {
            _id: "test-uuid-1234",
            ...validProductPayload,
            createdAt: "2026-09-18T12:00:00.000Z",
            updatedAt: "2026-09-18T12:00:00.000Z"
        };

        // Mock duplicate check (returns null)
        vi.mocked(Product.findOne).mockReturnValue({
            collation: vi.fn().mockReturnValue({
                lean: vi.fn().mockResolvedValue(null)
            })
        } as any);

        vi.mocked(Product.create).mockResolvedValue(mockSavedProduct as any);

        const res = await request(app)
            .post("/api/products")
            .send(validProductPayload);

        expect(res.status).toBe(201);
        expect(res.body).toEqual(mockSavedProduct);
    });

    it("should return 404 when fetching a non-existent product ID", async () => {
        vi.mocked(Product.findById).mockReturnValue({
            lean: vi.fn().mockResolvedValue(null)
        } as any);

        const res = await request(app).get("/api/products/invalid-uuid-999");

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Product does not exist.");
    });

    it("should allow partial updating with a subset of attributes (200 OK)", async () => {
        const updatedResult = {
            _id: "test-uuid-1234",
            name: "LSCS Shirt",
            price: 29.99, // Updated field
            stock: 100,
            category: "Clothing",
            size: "M",
            description: "Official committee shirt."
        };

        vi.mocked(Product.findByIdAndUpdate).mockReturnValue({
            lean: vi.fn().mockResolvedValue(updatedResult)
        } as any);

        const res = await request(app)
            .put("/api/products/test-uuid-1234")
            .send({ price: 29.99 });

        expect(res.status).toBe(200);
        expect(res.body.price).toBe(29.99);
    });
});