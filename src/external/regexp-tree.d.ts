import * as rp from "regexp-tree";

declare module "regexp-tree" {
    namespace Node {
        type AST =
            | RegExp
            | Disjunction
            | Alternative
            | Assertion
            | Char
            | CharacterClass
            | ClassRange
            | Backreference
            | Group
            | Repetition
            | Quantifier;
    }

    type NodeTypes = {
        "RegExp": Node.RegExp;
        "Disjunction": Node.Disjunction;
        "Alternative": Node.Alternative;
        "Assertion": Node.Assertion;
        "Char": Node.Char;
        "CharacterClass": Node.CharacterClass;
        "ClassRange": Node.ClassRange;
        "Backreference": Node.Backreference;
        "Group": Node.Group;
        "Repetition": Node.Repetition;
        "Quantifier": Node.Quantifier;
    };

    namespace NodePath {
        interface RegExp {
            node: Node.RegExp;
            parentPath: null;
            parent: null;
            property: null;
            index: null;
            getParent(): null;
            setChild<T extends Node.Expression>(node: T, index: null | undefined, property: "body"): NodePath<T>;
            setChild(node: null, index: null | undefined, property: "body"): null;
            setChild<T extends Node.Expression>(node: T | null, index: null | undefined, property: "body"): NodePath<T> | null;
            getChild(n?: number): NodePath<Node.Expression> | null;
            getPreviousSibling(): null;
            getNextSibling(): null;
            update(nodeProps: Partial<Node.RegExp>): void;
            remove(): void;
            isRemoved(): boolean;
            hasEqualSource(path: NodePath<Node.AST>): boolean;
            jsonEncode(options?: { format?: string | number, useLoc?: boolean }): string;
        }
        interface Disjunction {
            node: Node.Disjunction;
            parent: Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition | null;
            parentPath: NodePath<Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition> | null;
            property: string | null;
            index: number | null;
            getParent(): NodePath<Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition> | null;
            setChild<T extends Node.Expression>(node: T, index: number, property?: "expressions"): NodePath<T>;
            setChild(node: null, index: number, property?: "expressions"): null;
            setChild<T extends Node.Expression>(node: T | null, index: number, property?: "expressions"): NodePath<T> | null;
            appendChild<T extends Node.Expression>(node: T, property?: "expressions"): NodePath<T>;
            appendChild(node: null, property?: "expressions"): null;
            appendChild<T extends Node.Expression>(node: T | null, property?: "expressions"): NodePath<T> | null;
            insertChildAt<T extends Node.Expression>(node: T | null, index: number, property?: "expressions"): void;
            getChild(n?: number): NodePath<Node.Expression> | null;
            getPreviousSibling(): NodePath<Node.Expression> | null;
            getNextSibling(): NodePath<Node.Expression> | null;
            replace<T extends Node.Expression>(node: T): NodePath<T> | null;
            update(nodeProps: Partial<Node.Disjunction>): void;
            remove(): void;
            isRemoved(): boolean;
            hasEqualSource(path: NodePath<Node.AST>): boolean;
            jsonEncode(options?: { format?: string | number, useLoc?: boolean }): string;
        }
        interface Alternative {
            node: Node.Alternative;
            parent: Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition | null;
            parentPath: NodePath<Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition> | null;
            property: string | null;
            index: number | null;
            getParent(): NodePath<Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition> | null;
            setChild<T extends Node.Expression>(node: T, index: number, property?: "expressions"): NodePath<T>;
            appendChild<T extends Node.Expression>(node: T, property?: "expressions"): NodePath<T>;
            getChild(n?: number): NodePath<Node.Expression>;
            getPreviousSibling(): NodePath<Node.Expression> | null;
            getNextSibling(): NodePath<Node.Expression> | null;
            replace<T extends Node.Expression>(node: T): NodePath<T> | null;
            update(nodeProps: Partial<Node.Alternative>): void;
            remove(): void;
            isRemoved(): boolean;
            hasEqualSource(path: NodePath<Node.AST>): boolean;
            jsonEncode(options?: { format?: string | number, useLoc?: boolean }): string;
        }
        interface Assertion {
            node: Node.Assertion;
            parent: Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition | null;
            parentPath: NodePath<Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition> | null;
            property: string | null;
            index: number | null;
            getParent(): NodePath<Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition> | null;
            setChild<T extends Node.Expression>(node: T, index: null | undefined, property: "assertion"): NodePath<T>;
            setChild(node: null, index: null | undefined, property: "assertion"): null;
            setChild<T extends Node.Expression>(node: T | null, index: null | undefined, property: "assertion"): NodePath<T> | null;
            getPreviousSibling(): NodePath<Node.Expression> | null;
            getNextSibling(): NodePath<Node.Expression> | null;
            replace<T extends Node.Expression>(node: T): NodePath<T> | null;
            update(nodeProps: Partial<Node.Assertion>): void;
            remove(): void;
            isRemoved(): boolean;
            hasEqualSource(path: NodePath<Node.AST>): boolean;
            jsonEncode(options?: { format?: string | number, useLoc?: boolean }): string;
        }
        interface Char {
            node: Node.Char;
            parent: Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition | Node.CharacterClass | Node.ClassRange | null;
            parentPath: NodePath<Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition | Node.CharacterClass | Node.ClassRange> | null;
            property: string | null;
            index: number | null;
            getParent(): NodePath<Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition | Node.CharacterClass | Node.ClassRange> | null;
            getPreviousSibling(): NodePath<Node.Expression | Node.ClassRange> | null;
            getNextSibling(): NodePath<Node.Expression | Node.ClassRange> | null;
            replace<T extends Node.Expression | Node.ClassRange>(node: T): NodePath<T> | null;
            update(nodeProps: Partial<Node.Char>): void;
            remove(): void;
            isRemoved(): boolean;
            hasEqualSource(path: NodePath<Node.AST>): boolean;
            jsonEncode(options?: { format?: string | number, useLoc?: boolean }): string;
        }
        interface CharacterClass {
            node: Node.CharacterClass;
            parent: Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition | null;
            parentPath: NodePath<Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition> | null;
            property: string | null;
            index: number | null;
            getParent(): NodePath<Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition> | null;
            setChild<T extends Node.Char | Node.ClassRange>(node: T, index: number, property?: "expressions"): NodePath<T>;
            appendChild<T extends Node.Char | Node.ClassRange>(node: T, property?: "expressions"): NodePath<T>;
            insertChildAt<T extends Node.Char | Node.ClassRange>(node: T, index: number, property?: "expressions"): void;
            getChild(n?: number): NodePath<Node.Char | Node.ClassRange>;
            getPreviousSibling(): NodePath<Node.Expression> | null;
            getNextSibling(): NodePath<Node.Expression> | null;
            replace<T extends Node.Expression>(node: T): NodePath<T> | null;
            update(nodeProps: Partial<Node.CharacterClass>): void;
            remove(): void;
            isRemoved(): boolean;
            hasEqualSource(path: NodePath<Node.AST>): boolean;
            jsonEncode(options?: { format?: string | number, useLoc?: boolean }): string;
        }
        interface ClassRange {
            node: Node.ClassRange;
            parent: Node.CharacterClass | null;
            parentPath: NodePath<Node.CharacterClass> | null;
            property: string | null;
            index: number | null;
            getParent(): NodePath<Node.CharacterClass> | null;
            setChild(node: Node.Char, index: null | undefined, property: "from" | "to"): NodePath<Node.Char>;
            getPreviousSibling(): NodePath<Node.Char | Node.ClassRange> | null;
            getNextSibling(): NodePath<Node.Char | Node.ClassRange> | null;
            replace<T extends Node.Char | Node.ClassRange>(node: T): NodePath<T> | null;
            update(nodeProps: Partial<Node.ClassRange>): void;
            remove(): void;
            isRemoved(): boolean;
            hasEqualSource(path: NodePath<Node.AST>): boolean;
            jsonEncode(options?: { format?: string | number, useLoc?: boolean }): string;
        }
        interface Backreference {
            node: Node.Backreference;
            parent: Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition | null;
            parentPath: NodePath<Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition> | null;
            property: string | null;
            index: number | null;
            getParent(): NodePath<Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition> | null;
            getPreviousSibling(): NodePath<Node.Expression> | null;
            getNextSibling(): NodePath<Node.Expression> | null;
            replace<T extends Node.Expression>(node: T): NodePath<T> | null;
            update(nodeProps: Partial<Node.Backreference>): void;
            remove(): void;
            isRemoved(): boolean;
            hasEqualSource(path: NodePath<Node.AST>): boolean;
            jsonEncode(options?: { format?: string | number, useLoc?: boolean }): string;
        }
        interface Group {
            node: Node.Group;
            parent: Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition | null;
            parentPath: NodePath<Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition> | null;
            property: string | null;
            index: number | null;
            getParent(): NodePath<Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition> | null;
            setChild<T extends Node.Expression>(node: T, index: null | undefined, property?: "expression"): NodePath<T>;
            setChild(node: null, index: null | undefined, property?: "expression"): null;
            setChild<T extends Node.Expression>(node: T | null, index: null | undefined, property?: "expression"): NodePath<T> | null;
            getChild(n?: 0): NodePath<Node.Expression> | null;
            getPreviousSibling(): NodePath<Node.Expression> | null;
            getNextSibling(): NodePath<Node.Expression> | null;
            replace<T extends Node.Expression>(node: T): NodePath<T> | null;
            update(nodeProps: Partial<Node.Group>): void;
            remove(): void;
            isRemoved(): boolean;
            hasEqualSource(path: NodePath<Node.AST>): boolean;
            jsonEncode(options?: { format?: string | number, useLoc?: boolean }): string;
        }
        interface Repetition {
            node: Node.Repetition;
            parent: Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition | null;
            parentPath: NodePath<Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition> | null;
            property: string | null;
            index: number | null;
            getParent(): NodePath<Node.RegExp | Node.Disjunction | Node.Alternative | Node.Assertion | Node.Group | Node.Repetition> | null;
            setChild<T extends Node.Expression>(node: T, index: null | undefined, property?: "expression"): NodePath<T>;
            setChild<T extends Node.Quantifier>(node: T, index: null | undefined, property: "quantifier"): NodePath<T>;
            getChild(n?: 0): NodePath<Node.Expression> | null;
            getPreviousSibling(): NodePath<Node.Expression> | null;
            getNextSibling(): NodePath<Node.Expression> | null;
            replace<T extends Node.Expression>(node: T): NodePath<T> | null;
            update(nodeProps: Partial<Node.Repetition>): void;
            remove(): void;
            isRemoved(): boolean;
            hasEqualSource(path: NodePath<Node.AST>): boolean;
            jsonEncode(options?: { format?: string | number, useLoc?: boolean }): string;
        }
        interface Quantifier {
            node: Node.Quantifier;
            parent: Node.Repetition | null;
            parentPath: NodePath<Node.Repetition> | null;
            property: string | null;
            index: number | null;
            getParent(): NodePath<Node.Repetition> | null;
            getPreviousSibling(): null;
            getNextSibling(): null;
            replace<T extends Node.Quantifier>(node: T): NodePath<T> | null;
            update(nodeProps: Partial<Node.Quantifier>): void;
            remove(): void;
            isRemoved(): boolean;
            hasEqualSource(path: NodePath<Node.AST>): boolean;
            jsonEncode(options?: { format?: string | number, useLoc?: boolean }): string;
        }
    }

    type NodePathTypes = {
        "RegExp": NodePath.RegExp;
        "Disjunction": NodePath.Disjunction;
        "Alternative": NodePath.Alternative;
        "Assertion": NodePath.Assertion;
        "Char": NodePath.Char;
        "CharacterClass": NodePath.CharacterClass;
        "ClassRange": NodePath.ClassRange;
        "Backreference": NodePath.Backreference;
        "Group": NodePath.Group;
        "Repetition": NodePath.Repetition;
        "Quantifier": NodePath.Quantifier;
    };

    type NodePath<T extends Node.AST = Node.AST> = NodePathTypes[T["type"]];

    type TraversalCallback<T extends Node.AST = Node.AST, TraversalKind extends "Node" | "NodePath" = "NodePath"> = {
        Node: (node: T, parent: NodePath<T>["parent"] | null, prop?: string, index?: number) => void | boolean;
        NodePath: (path: NodePath<T>) => void | boolean;
    }[TraversalKind];

    type TraversalCallbacks<T extends Node.AST = Node.AST, TraversalKind extends "Node" | "NodePath" = "NodePath"> = {
        pre?: TraversalCallback<T, TraversalKind>;
        post?: TraversalCallback<T, TraversalKind>;
    };

    type Traversal<T extends Node.AST = Node.AST, TraversalKind extends "Node" | "NodePath" = "NodePath"> = TraversalCallback<T, TraversalKind> | TraversalCallbacks<T, TraversalKind>;

    type CommonTraversalHandlers<T extends Node.AST, TraversalKind extends "Node" | "NodePath" = "NodePath"> = {
        "*"?: TraversalCallback<Node.AST, TraversalKind>;
        shouldRun?(ast: T): boolean;
        init?(ast: T): void;
    };

    type SpecificTraversalHandlers<TraversalKind extends "Node" | "NodePath" = "NodePath"> = {
        [N in keyof NodeTypes]?: Traversal<NodeTypes[N], TraversalKind>;
    };

    type TraversalHandlers<T extends Node.AST = Node.AST, TraversalKind extends "Node" | "NodePath" = "NodePath"> =
        & CommonTraversalHandlers<T, TraversalKind>
        & SpecificTraversalHandlers<TraversalKind>;

    type TransformHandlers<T extends Node.AST = Node.AST> = TraversalHandlers<T, "NodePath">;

    class TransformResult<T extends Node.AST = Node.AST, E = any> {
        private _ast;
        private _source;
        private _string;
        private _regexp;
        private _extra;
        constructor(ast: T, extra?: E);
        getAST(): T;
        setExtra(extra: E): void;
        getExtra(): E;
        toRegExp(): RegExp;
        getSource(): string;
        getFlags(): string;
        toString(): string;
    }

    function traverse<T extends Node.AST>(ast: T, handlers: TraversalHandlers<T, "Node"> | ReadonlyArray<TraversalHandlers<T, "Node">>, options: { TraversalKind: true }): void;
    function traverse<T extends Node.AST>(ast: T, handlers: TraversalHandlers<T, "NodePath"> | ReadonlyArray<TraversalHandlers<T, "NodePath">>, options?: { TraversalKind?: false }): void;
    function transform<T extends Node.AST>(ast: T, handlers: TransformHandlers<T> | ReadonlyArray<TransformHandlers<T>>): TransformResult<T>;
    function transform(regexp: string | RegExp, handlers: TransformHandlers<Node.RegExp> | ReadonlyArray<TransformHandlers<Node.RegExp>>): TransformResult<Node.RegExp>;
    function generate(ast: Node.RegExp): string;
    function toRegExp(regexp: string): RegExp;
    function optimize(regexp: string, whitelist?: ReadonlyArray<string>): TransformResult<Node.RegExp>;
    function compatTranspile(regexp: string, whitelist?: ReadonlyArray<string>): TransformResult<Node.RegExp>;
    function exec(re: string | RegExp, string: string): RegExpExecArray;
}