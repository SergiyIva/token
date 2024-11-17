import {AuthToken} from "../lib/index.js";
import {describe, it,} from "node:test";
import assert from "node:assert";

describe("AuthToken class tests", () => {
    const auth = new AuthToken("1234|1234");
    it("auth must be defined", () => {
        assert(!!auth);
    });
    it("must generate token and decode it correct", async () => {
        const data = {
            test: "test",
        }
        const token = await auth.makeToken(data)
        assert(token);
        const payload = await auth.decodeAndCheck(token)
        assert(payload.test === "test");
    })
});