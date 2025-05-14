import { Project, SyntaxKind } from "ts-morph";
import { tokenToString } from "typescript";
import {
	CodeAction,
	CodeActionKind,
	type CodeActionProvider,
	env,
	type ProviderResult,
	Range,
	type TextDocument,
	WorkspaceEdit,
} from "vscode";
import { getLocaleResources } from "../localeResources";

export class FlipBinaryExpressionProvider implements CodeActionProvider {
	provideCodeActions(
		document: TextDocument,
		range: Range,
	): ProviderResult<CodeAction[]> {
		const fullText = document.getText();
		const sourceFile = new Project({
			useInMemoryFileSystem: true,
		}).createSourceFile("temp.ts", fullText, {
			overwrite: true,
		});

		// カーソル位置に該当する BinaryExpression を探す
		const offset = document.offsetAt(range.start);
		const node = sourceFile.getDescendantAtPos(offset);
		const binExp = node?.getFirstAncestorByKind(SyntaxKind.BinaryExpression);

		// カーソルが比較演算子式の中にない場合は何もしない
		if (!binExp) {
			return;
		}

		const opText = binExp.getOperatorToken().getText();
		const opKind = binExp.getOperatorToken().getKind();
		const lhsText = binExp.getLeft().getText();
		const rhsText = binExp.getRight().getText();
		const operatorToken = binExp.getOperatorToken();

		// Get the original whitespace
		const lhsEnd = binExp.getLeft().getEnd();
		const operatorStart = operatorToken.getStart();
		const whitespaceBeforeOp = fullText.slice(lhsEnd, operatorStart);

		const operatorEnd = operatorToken.getEnd();
		const rhsStart = binExp.getRight().getStart();
		const whitespaceAfterOp = fullText.slice(operatorEnd, rhsStart);

		const { flippedOp: flippedOpText, mayChangeSemantics } =
			getFlippedOperatorInfoByKind(opKind);
		const flippedExpression = `${rhsText}${whitespaceBeforeOp}${flippedOpText}${whitespaceAfterOp}${lhsText}`;

		const localeResources = getLocaleResources(env.language);
		const action = new CodeAction(
			localeResources.flipBinaryOperator({
				fromOp: opText,
				toOp: opText !== flippedOpText ? flippedOpText : undefined,
				mayChangeSemantics,
			}),
			CodeActionKind.QuickFix,
		);
		action.edit = new WorkspaceEdit();
		action.edit.replace(
			document.uri,
			new Range(
				document.positionAt(binExp.getStart()),
				document.positionAt(binExp.getEnd()),
			),
			flippedExpression,
		);
		return [action];
	}
}

interface FlippedOperatorInfo {
	flippedOp: string;
	mayChangeSemantics: boolean;
}

// SyntaxKind → FlippedOperatorInfo の対応表
const getFlippedOperatorInfoByKind = (
	opKind: SyntaxKind,
): FlippedOperatorInfo => {
	switch (opKind) {
		// 比較演算子
		case SyntaxKind.LessThanToken: {
			return { flippedOp: ">", mayChangeSemantics: false };
		}
		case SyntaxKind.GreaterThanToken: {
			return { flippedOp: "<", mayChangeSemantics: false };
		}
		case SyntaxKind.LessThanEqualsToken: {
			return { flippedOp: ">=", mayChangeSemantics: false };
		}
		case SyntaxKind.GreaterThanEqualsToken: {
			return { flippedOp: "<=", mayChangeSemantics: false };
		}
		case SyntaxKind.EqualsEqualsToken: {
			return { flippedOp: "==", mayChangeSemantics: false };
		}
		case SyntaxKind.EqualsEqualsEqualsToken: {
			return { flippedOp: "===", mayChangeSemantics: false };
		}
		case SyntaxKind.ExclamationEqualsToken: {
			return { flippedOp: "!=", mayChangeSemantics: false };
		}
		case SyntaxKind.ExclamationEqualsEqualsToken: {
			return { flippedOp: "!==", mayChangeSemantics: false };
		}

		// 算術演算子
		case SyntaxKind.PlusToken: {
			return { flippedOp: "+", mayChangeSemantics: false };
		}
		case SyntaxKind.AsteriskToken: {
			return { flippedOp: "*", mayChangeSemantics: false };
		}
		case SyntaxKind.MinusToken: {
			return { flippedOp: "-", mayChangeSemantics: true };
		}
		case SyntaxKind.SlashToken: {
			return { flippedOp: "/", mayChangeSemantics: true };
		}
		case SyntaxKind.PercentToken: {
			return { flippedOp: "%", mayChangeSemantics: true };
		}
		case SyntaxKind.AsteriskAsteriskToken: {
			return { flippedOp: "**", mayChangeSemantics: true };
		}

		// 論理演算子
		case SyntaxKind.AmpersandAmpersandToken: {
			return { flippedOp: "&&", mayChangeSemantics: false };
		}
		case SyntaxKind.BarBarToken: {
			return { flippedOp: "||", mayChangeSemantics: false };
		}

		// ビット演算子
		case SyntaxKind.AmpersandToken: {
			return { flippedOp: "&", mayChangeSemantics: false };
		}
		case SyntaxKind.BarToken: {
			return { flippedOp: "|", mayChangeSemantics: false };
		}
		case SyntaxKind.CaretToken: {
			return { flippedOp: "^", mayChangeSemantics: false };
		}
		case SyntaxKind.GreaterThanGreaterThanToken: {
			return { flippedOp: ">>", mayChangeSemantics: true };
		}
		case SyntaxKind.LessThanLessThanToken: {
			return { flippedOp: "<<", mayChangeSemantics: true };
		}
		case SyntaxKind.GreaterThanGreaterThanGreaterThanToken: {
			return { flippedOp: ">>>", mayChangeSemantics: true };
		}
		default: {
			return {
				flippedOp: tokenToString(opKind) ?? "",
				mayChangeSemantics: false,
			};
		}
	}
};
