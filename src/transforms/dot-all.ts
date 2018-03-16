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

const handlers: TransformHandlers<Node.RegExp> = {
    RegExp(path) {
        if (!path.node.flags.includes("s")) return false;
        path.update({ flags: path.node.flags.replace("s", "") });
    },
    Char(path) {
        if (path.node.kind !== "meta" || path.node.value !== ".") return;
        path.replace({ type: "CharacterClass", negative: true, expressions: [] });
    }
};

export function transformDotAll(ast: Node.RegExp) {
    return transform(ast, handlers);
}