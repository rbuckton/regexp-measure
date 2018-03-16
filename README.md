# regexp-measure

This library exposes a `RegExp2` subclass to the `RegExp` built-in class that extends the `exec` method to return offset information for capture groups:

```js
const { RegExp2 } = require("regexp-measure");

const text = "zabbcdef";
const re = new RegExp2("ab*(cd(?<Z>ef)?)");
const result = re.test(text);
console.log(result.index);      // 1
console.log(result.offsets);    // [0, 3, 5]

// result.offsets[0] is the offset of result[0] from result.index
const a = text.slice(result.index + result.offsets[0]);
console.log(a);                 // abbcdef

// result.offsets[1] is the offset of result[1] from result.index
const b = text.slice(result.index + result.offsets[1]);
console.log(b);                 // cdef

// result.offsets[2] is the offset of result[2] from result.index
const c = text.slice(result.index + result.offsets[2]);
console.log(c);                 // ef

// result.offsets.groups stores the offsets to named capture groups
const d = text.slice(result.index + result.offsets.groups["Z"]);
console.log(d);                 // ef
```

## Installation

```sh
npm install regexp-measure
```

## API

```ts
export declare class RegExp2 extends RegExp {
    constructor(pattern: string | RegExp, flags?: string);
    readonly source: string;
    readonly flags: string;
    readonly dotAll: boolean;
    exec(text: string): RegExp2ExecArray | null;
    toString(): string;
}

export interface RegExp2ExecArray extends RegExpExecArray {
    groups: { [groupName: string]: string; };
    offsets: RegExp2OffsetsArray;
}

export interface RegExp2OffsetsArray extends Array<number> {
    groups: { [groupName: string]: number; };
}
```