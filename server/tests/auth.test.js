import { describe, it, expect } from "vitest";
import bcrypt from "bcrypt";

// simple function similar to what the backend does
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

describe("Authentication Test", () => {
    it("should hash and verify a user password correctly", async () => {
        const password = "test123";

        const hashedPassword = await hashPassword(password);

        const isMatch = await bcrypt.compare(password, hashedPassword);

        expect(isMatch).toBe(true);
    });
});