import type en from "./en";

const ja: typeof en = {
	flipBinaryOperator: (params: {
		fromOp: string;
		toOp?: string | undefined;
		mayChangeSemantics?: boolean | undefined;
	}) =>
		`'${params.fromOp}' を${params.toOp ? ` '${params.toOp}' に` : ""}反転${params.mayChangeSemantics ? " (動作が変わる可能性あり)" : ""}`,
	flipCommaSeparatedElements: () =>
		`',' の前後を入れ替える (動作が変わる可能性あり)`,
};
export default ja;
