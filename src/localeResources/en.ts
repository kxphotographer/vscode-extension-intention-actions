export default {
	flipBinaryOperator: (params: {
		fromOp: string;
		toOp?: string | undefined;
		mayChangeSemantics?: boolean | undefined;
	}) =>
		`Flip '${params.fromOp}'${params.toOp ? ` to '${params.toOp}'` : ""}${params.mayChangeSemantics ? " (may change semantics)" : ""}`,
	flipCommaSeparatedElements: () => `Flip ',' (may change semantics)`,
} as const;
