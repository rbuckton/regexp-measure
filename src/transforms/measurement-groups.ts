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

import { NodePath, TransformHandlers, TraversalHandlers, TraversalCallbacks, traverse, transform, NodeTypes, Node, TransformResult } from "regexp-tree";

export interface GroupInfo {
    readonly oldGroupNumber: number;
    readonly newGroupNumber: number;
    readonly measurementGroups: ReadonlyArray<number> | undefined;
}

let groupRenumbers: GroupInfo[] | undefined;
let hasBackreferences = false;
let nodesContainingCapturingGroup = new Set<Node.AST>();
let containsCapturingGroupStack: boolean[] = [];
let containsCapturingGroup = false;
let nextNewGroupNumber = 1;
let measurementGroupStack: Node.CapturingGroup[][] = [];
let measurementGroupsForGroup = new Map<Node.CapturingGroup, Node.CapturingGroup[]>();
let newGroupNumberForGroup = new Map<number, number>();

const handlers: TransformHandlers<Node.RegExp> = {
    init() {
        hasBackreferences = false;
        nodesContainingCapturingGroup.clear();
        containsCapturingGroupStack.length = 0;
        containsCapturingGroup = false;
        nextNewGroupNumber = 1;
        measurementGroupStack.length = 0;
        measurementGroupsForGroup.clear();
        newGroupNumberForGroup.clear();
        groupRenumbers = [];
    },
    RegExp(path) {
        traverse(path.node, visitor);
        if (nodesContainingCapturingGroup.size > 0) {
            transform(path.node, builder);
            transform(path.node, groupRenumberer);
            if (hasBackreferences) {
                transform(path.node, backreferenceRenumberer);
            }
        }
        return false;
    }
}

const nodeCallbacks: TraversalCallbacks = {
    pre(path) {
        containsCapturingGroupStack.push(containsCapturingGroup);
        containsCapturingGroup = path.node.type === "Group" && path.node.capturing;
    },
    post(path) {
        if (containsCapturingGroup) {
            nodesContainingCapturingGroup.add(path.node);
        }
        containsCapturingGroup = containsCapturingGroupStack.pop() || containsCapturingGroup;
    }
};

const visitor: TraversalHandlers = {
    Alternative: nodeCallbacks,
    Disjunction: nodeCallbacks,
    Assertion: nodeCallbacks,
    Group: nodeCallbacks,
    Repetition: nodeCallbacks,
    Backreference(path) { hasBackreferences = true; }
};

const builder: TransformHandlers = {
    Alternative(path) {
        if (nodesContainingCapturingGroup.has(path.node)) {
            // aa(b)c       -> (aa)(b)c
            // aa(b)c(d)    -> (aa)(b)(c)(d)
            // aa(b)+c(d)   -> (aa)((b)+)(c)(d);
            let lastMeasurementIndex = 0;
            let pendingTerms: Node.Expression[] = [];
            const measurementGroups: Node.CapturingGroup[] = [];
            const terms: Node.Expression[] = [];
            for (let i = 0; i < path.node.expressions.length; i++) {
                const term = path.node.expressions[i];
                if (nodesContainingCapturingGroup.has(term)) {
                    if (i > lastMeasurementIndex) {
                        const measurementGroup: Node.CapturingGroup = {
                            type: "Group",
                            capturing: true,
                            number: -1,
                            expression:
                                pendingTerms.length > 1 ? { type: "Alternative", expressions: pendingTerms } :
                                pendingTerms.length === 1 ? pendingTerms[0] :
                                null
                        };
                        terms.push(measurementGroup);
                        measurementGroups.push(measurementGroup);
                        lastMeasurementIndex = i;
                        pendingTerms = [];
                    }
                    measurementGroupStack.push(measurementGroups);
                    transform(term, builder);
                    measurementGroupStack.pop();
                    pendingTerms.push(term);
                    continue;
                }

                pendingTerms.push(term);
            }
            path.update({ expressions: terms.concat(pendingTerms) });
        }
        return false;
    },
    Group(path) {
        if (!path.node.capturing) return;
        measurementGroupsForGroup.set(path.node, getMeasurementGroups());
    }
};

const groupRenumberer: TransformHandlers = {
    Group(path) {
        if (!groupRenumbers) throw new Error("Not initialized.");
        if (!path.node.capturing) return;
        const oldGroupNumber = path.node.number;
        const newGroupNumber = nextNewGroupNumber++;
        const measurementGroups = measurementGroupsForGroup.get(path.node);
        if (oldGroupNumber !== -1) {
            groupRenumbers.push({
                oldGroupNumber,
                newGroupNumber,
                measurementGroups: measurementGroups && measurementGroups.map(group => group.number)
            });
            newGroupNumberForGroup.set(oldGroupNumber, newGroupNumber);
        }
        path.update({ number: newGroupNumber });
    }
};

const backreferenceRenumberer: TransformHandlers = {
    Backreference(path) {
        const newGroupNumber = newGroupNumberForGroup.get(path.node.number);
        if (newGroupNumber) {
            if (path.node.kind === "number") {
                path.update({
                    number: newGroupNumber,
                    reference: newGroupNumber
                });
            }
            else {
                path.update({
                    number: newGroupNumber
                });
            }
        }
    }
};

function getMeasurementGroups() {
    const measurementGroups: Node.CapturingGroup[] = [];
    for (const array of measurementGroupStack) {
        for (const item of array) {
            measurementGroups.push(item);
        }
    }
    return measurementGroups;
}

export function transformMeasurementGroups(ast: Node.RegExp) {
    const result = transform(ast, handlers);
    if (!groupRenumbers) throw new Error("Not initialized.");
    return new TransformResult(ast, groupRenumbers as ReadonlyArray<GroupInfo>);
}