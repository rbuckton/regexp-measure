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

import { TransformResult, Node, transform, traverse, parse, generate } from "regexp-tree";
import { transformDotAll } from "./transforms/dot-all";
import { transformNamedCaptureGroups } from "./transforms/named-capture-groups";
import { transformMeasurementGroups, GroupInfo } from "./transforms/measurement-groups";
import * as features from "./features";

export interface RegExp2OffsetsArray extends Array<number> {
    groups: { [groupName: string]: number; };
}

export interface RegExp2ExecArray extends RegExpExecArray {
    groups: { [groupName: string]: string; };
    offsets: RegExp2OffsetsArray;
}

export class RegExp2 extends RegExp {
    private _source: string;
    private _flags: string;
    private _debugSource: string;
    private _debugFlags: string;
    private _groupNames: ReadonlyMap<string, number> | undefined;
    private _groupRenumbers: ReadonlyArray<GroupInfo> | undefined;

    constructor(pattern: string | RegExp, flags?: string) {
        if (flags === undefined) flags = typeof pattern === "string" ? "" : pattern.flags;
        if (typeof pattern !== "string") pattern = pattern.source;
        let sourcePattern = pattern;
        let sourceFlags = flags;
        let groupNames: ReadonlyMap<string, number> | undefined;
        let groupRenumbers: ReadonlyArray<GroupInfo> | undefined;
        if (!features.dotAll || !features.namedCaptureGroups || !features.offsets) {
            let result = new TransformResult(parse(`/${pattern}/${flags}`));
            if (!features.dotAll) {
                result = transformDotAll(result.getAST());
            }
            if (!features.namedCaptureGroups) {
                const captureGroupsResult = transformNamedCaptureGroups(result.getAST());
                groupNames = captureGroupsResult.getExtra();
                result = captureGroupsResult;
            }
            if (!features.offsets) {
                if (features.namedCaptureGroups) {
                    const names = new Map<string, number>();
                    traverse(result.getAST(), {
                        Group(path) {
                            if (path.node.capturing && path.node.name) {
                                names.set(path.node.name, path.node.number);
                            }
                        }
                    });
                    groupNames = names;
                }

                const measurementGroupsResult = transformMeasurementGroups(result.getAST());
                groupRenumbers = measurementGroupsResult.getExtra();
                result = measurementGroupsResult;
            }
            sourcePattern = result.getSource();
            sourceFlags = result.getFlags();
        }
        super(sourcePattern, sourceFlags);
        this._source = pattern;
        this._flags = flags;
        this._debugSource = sourcePattern;
        this._debugFlags = sourceFlags;
        this._groupNames = groupNames;
        this._groupRenumbers = groupRenumbers;
    }

    public get source() {
        return this._source;
    }

    public get flags() {
        return this._flags;
    }

    public get dotAll() {
        return this._flags.includes("s");
    }

    public exec(text: string) {
        const result = super.exec(text);
        if (result && (this._groupNames || this._groupRenumbers)) {
            const newResult = [result[0]] as RegExp2ExecArray;
            newResult.index = result.index;
            newResult.input = result.input;
            if (this._groupRenumbers) {
                newResult.offsets = [0] as RegExp2OffsetsArray;
                for (const group of this._groupRenumbers) {
                    newResult[group.oldGroupNumber] = result[group.newGroupNumber];
                }
            }
            else {
                newResult.offsets = (<any>result).offsets;
            }

            if (this._groupNames) {
                newResult.groups = {};
                for (const [key, value] of this._groupNames) {
                    newResult.groups[key] = newResult[value];
                }
            }
            else {
                newResult.groups = (<any>result).groups;
            }

            if (this._groupRenumbers) {
                for (const group of this._groupRenumbers) {
                    let offset = 0;
                    if (group.measurementGroups) {
                        for (const measurementGroup of group.measurementGroups) {
                            offset += result[measurementGroup].length;
                        }
                    }
                    newResult.offsets[group.oldGroupNumber] = offset;
                }
            }

            if (this._groupRenumbers && this._groupNames) {
                newResult.offsets.groups = {};
                for (const [key, value] of this._groupNames) {
                    newResult.offsets.groups[key] = newResult.offsets[value];
                }
            }

            return newResult;
        }
        return null;
    }

    public toString() {
        return `/${this._source}/${this._flags}`;
    }
}