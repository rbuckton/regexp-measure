import { RegExp2 } from "../regexp";

describe("measurement", () => {
    it("one", () => {
        const re = new RegExp2("a(b)");
        const result = re.exec("ab")!;
        expect(result.offsets[0]).toBe(0);
        expect(result.offsets[1]).toBe(1);
        expect(result.offsets.groups).toEqual({});
    });
    it("number backreference", () => {
        const re = new RegExp2("a(b)\\1");
        const result = re.exec("abb")!;
        expect(result.offsets[0]).toBe(0);
        expect(result.offsets[1]).toBe(1);
        expect(result.offsets.groups).toEqual({});
    });
    it("named backreference", () => {
        const re = new RegExp2("a(?<B>b)\\k<B>");
        const result = re.exec("abb")!;
        expect(result.offsets[0]).toBe(0);
        expect(result.offsets[1]).toBe(1);
        expect(result.offsets.groups).toEqual({ B: 1 });
    });
    it("lookbehind", () => {
        const re = new RegExp2("(?<=a)b");
        const result = re.exec("ab")!;
        expect(result.offsets.length).toBe(1);
    });
});