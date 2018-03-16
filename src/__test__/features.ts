import * as features from "../features";
import { RegExp2 } from "../regexp";

class MockRegExp extends RegExp {
    constructor(pattern: string, flags?: string) { super("^$"); this._constructor(pattern, flags); }
    _constructor(pattern: string, flags?: string) {}
    get flags() { return ""; }
    get dotAll() { return false; }
    test(_: string) { return false; }
    exec(_: string) { return null; }
}

it("dotAll", () => {
    expect(features.supportsDotAll(class extends MockRegExp {
        _constructor() { throw new SyntaxError(); }
    })).toEqual(false);
    expect(features.supportsDotAll(class extends MockRegExp {
    })).toEqual(false);
    expect(features.supportsDotAll(class extends MockRegExp {
        get flags() { return "s"; }
    })).toEqual(false);
    expect(features.supportsDotAll(class extends MockRegExp {
        get flags() { return "s"; }
        get dotAll() { return true }
    })).toEqual(false);
    expect(features.supportsDotAll(class extends MockRegExp {
        get flags() { return "s"; }
        get dotAll() { return true }
        test() { return true }
    })).toEqual(true);
    expect(features.supportsDotAll(RegExp2)).toEqual(true);
});

it("namedCaptureGroups", () => {
    expect(features.supportsNamedCaptureGroups(class extends MockRegExp {
        _constructor() { throw new SyntaxError(); }
    })).toEqual(false);
    expect(features.supportsNamedCaptureGroups(class extends MockRegExp {
    })).toEqual(false);
    expect(features.supportsNamedCaptureGroups(class extends MockRegExp {
        exec(): any { return {}; }
    })).toEqual(false);
    expect(features.supportsNamedCaptureGroups(class extends MockRegExp {
        exec(): any { return { 0: "aa" }; }
    })).toEqual(false);
    expect(features.supportsNamedCaptureGroups(class extends MockRegExp {
        exec(): any { return { 0: "aa", 1: "a" }; }
    })).toEqual(false);
    expect(features.supportsNamedCaptureGroups(class extends MockRegExp {
        exec(): any { return { 0: "aa", 1: "a", groups: {} }; }
    })).toEqual(false);
    expect(features.supportsNamedCaptureGroups(class extends MockRegExp {
        exec(): any { return { 0: "aa", 1: "a", groups: { "A": "" } }; }
    })).toEqual(false);
    expect(features.supportsNamedCaptureGroups(class extends MockRegExp {
        exec(): any { return { 0: "aa", 1: "a", groups: { "A": "a" } }; }
    })).toEqual(true);
    expect(features.supportsNamedCaptureGroups(RegExp2)).toEqual(true);
});

it("lookbehind", () => {
    expect(features.supportsLookbehind(class extends MockRegExp {
        _constructor(pattern: string) { if (pattern === "(?<=a)b") throw new SyntaxError(); }
    })).toEqual(false);
    expect(features.supportsLookbehind(class extends MockRegExp {
        exec(text: string): any { return text === "ab" ? {} : null; }
    })).toEqual(false);
    expect(features.supportsLookbehind(class extends MockRegExp {
        exec(text: string): any { return text === "ab" ? { 0: "b" } : null; }
        test(text: string) { return text === "zb"; }
    })).toEqual(false);
    expect(features.supportsLookbehind(class extends MockRegExp {
        _constructor(pattern: string) { if (pattern === "(?<!a)b") throw new SyntaxError(); }
    })).toEqual(false);
    expect(features.supportsLookbehind(class extends MockRegExp {
        exec(text: string): any { return text === "ab" ? { 0: "b" } : {}; }
        test(text: string) { return text === "zb"; }
    })).toEqual(false);
    expect(features.supportsLookbehind(class extends MockRegExp {
        exec(text: string): any { return { 0: "b" }; }
        test(text: string) { return text === "zb"; }
    })).toEqual(false);
    expect(features.supportsLookbehind(class extends MockRegExp {
        exec(text: string): any { return { 0: "b" }; }
        test(text: string) { return false; }
    })).toEqual(true);
    expect(features.supportsLookbehind(RegExp2)).toEqual(features.supportsLookbehind(RegExp));
});

it("offsets", () => {
    expect(features.supportsOffsets(class extends MockRegExp {
        _constructor() { throw new SyntaxError(); }
    })).toEqual(false);
    expect(features.supportsOffsets(class extends MockRegExp {
    })).toEqual(false);
    expect(features.supportsOffsets(class extends MockRegExp {
        exec(): any { return {}; }
    })).toEqual(false);
    expect(features.supportsOffsets(class extends MockRegExp {
        exec(): any { return { offsets: {} }; }
    })).toEqual(false);
    expect(features.supportsOffsets(class extends MockRegExp {
        exec(): any { return { offsets: { 0: 0 } }; }
    })).toEqual(false);
    expect(features.supportsOffsets(class extends MockRegExp {
        exec(): any { return { offsets: { 0: 0, 1: 1 } }; }
    })).toEqual(true);
    expect(features.supportsOffsets(class extends MockRegExp {
        exec(text: string): any {
            return text === "aa" ? { 0: "aa", 1: "a", groups: { "A": "a" } } : { offsets: { 0: 0, 1: 1 } };
        }
    })).toEqual(false);
    expect(features.supportsOffsets(class extends MockRegExp {
        exec(text: string): any {
            return text === "aa" ? { 0: "aa", 1: "a", groups: { "A": "a" } } : { offsets: { 0: 0, 1: 1, groups: {} } };
        }
    })).toEqual(false);
    expect(features.supportsOffsets(class extends MockRegExp {
        exec(text: string): any {
            return text === "aa" ? { 0: "aa", 1: "a", groups: { "A": "a" } } : { offsets: { 0: 0, 1: 1, groups: { "B": 1 } } };
        }
    })).toEqual(true);
    expect(features.supportsOffsets(RegExp2)).toEqual(true);
});