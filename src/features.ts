/*!
 *   Copyright 2018 Ron Buckton
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

export const dotAll = supportsDotAll(RegExp);
export const namedCaptureGroups = supportsNamedCaptureGroups(RegExp);
export const lookbehind = supportsLookbehind(RegExp);
export const offsets = supportsOffsets(RegExp);

export function supportsDotAll(F: new (pattern: string, flags?: string) => RegExp) {
    try {
        const re = new F(".", "s");
        return re.flags.includes("s") && (<any>re).dotAll && re.test("\n");
    }
    catch {
        return false;
    }
}

export function supportsNamedCaptureGroups(F: new (pattern: string, flags?: string) => RegExp) {
    try {
        const re = new F("(?<A>a)\\k<A>");
        const m = re.exec("aa");
        return !!m && m[0] === "aa" && m[1] === "a" && !!(<any>m).groups && (<any>m).groups["A"] === "a";
    }
    catch {
        return false;
    }
}

export function supportsLookbehind(F: new (pattern: string, flags?: string) => RegExp) {
    try {
        const positiveRegExp = new F("(?<=a)b");
        const positiveMatch = positiveRegExp.exec("ab");
        const positiveLookbehind = !!positiveMatch && positiveMatch[0] === "b" && !positiveRegExp.test("zb");
        if (!positiveLookbehind) return false;
        const negativeRegExp = new F("(?<!a)b");
        const negativeMatch = negativeRegExp.exec("zb");
        const negativeLookbehind = !!negativeMatch && negativeMatch[0] === "b" && !negativeRegExp.test("ab");
        return negativeLookbehind;
    }
    catch {
        return false;
    }
}

export function supportsOffsets(F: new (pattern: string, flags?: string) => RegExp) {
    try {
        const re = new F(supportsNamedCaptureGroups(F) ? "a(?<B>b)" : "a(b)");
        const m = re.exec("ab");
        if (!m) return false;
        const offsets = (<any>m).offsets;
        if (!offsets || offsets[0] !== 0 || offsets[1] !== 1) return false;
        if (supportsNamedCaptureGroups(F)) {
            const groups = offsets.groups;
            if (!groups || groups["B"] !== 1) return false;
        }
        return true;
    }
    catch {
        return false;
    }
}