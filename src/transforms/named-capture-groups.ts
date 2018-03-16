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

import { TransformHandlers, Node, TransformResult, transform } from "regexp-tree";

let groupNames: Map<string, number> | undefined;

const handlers: TransformHandlers<Node.RegExp> = {
    init() {
        groupNames = new Map<string, number>();
    },
    Group(path) {
        if (!groupNames) throw new Error("Not initialized.");
        if (!path.node.capturing || !path.node.name) return;

        groupNames.set(path.node.name, path.node.number);
        path.replace({
            type: "Group",
            capturing: true,
            number: path.node.number,
            expression: path.node.expression
        });
    },
    Backreference(path) {
        if (!groupNames) throw new Error("Not initialized.");
        if (path.node.kind !== "name") return;

        path.replace({
            type: "Backreference",
            kind: "number",
            number: path.node.number,
            reference: path.node.number
        });
    }
};

export function transformNamedCaptureGroups(ast: Node.RegExp) {
    const result = transform(ast, handlers);
    if (!groupNames) throw new Error("Not initialized.");
    return new TransformResult(ast, groupNames as ReadonlyMap<string, number>);
}