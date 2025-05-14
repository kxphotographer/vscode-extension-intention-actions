import { Project, SyntaxKind } from "ts-morph";
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

export class FlipCommaSeparatedElementsProvider implements CodeActionProvider {
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

		// カーソル位置に該当するカンマを探す
		const offset = document.offsetAt(range.start);
		const node = sourceFile.getDescendantAtPos(offset);
		const commaToken =
			node?.getKind() === SyntaxKind.CommaToken ? node : undefined;

		// カーソルがカンマの中にない場合は何もしない
		if (!commaToken) {
			console.log(
				"[FlipCommaSeparatedElementsProvider] No comma token found at cursor position",
			);
			return;
		}

		// カンマの前後の要素を取得
		const parent = commaToken.getParent();
		if (!parent) {
			console.log(
				"[FlipCommaSeparatedElementsProvider] Comma token has no parent",
			);
			return;
		}

		// 配列、関数引数、タプルなどの要素リストを取得
		const elements = parent.getChildrenOfKind(SyntaxKind.SyntaxList);
		if (!elements[0]) {
			console.log(
				"[FlipCommaSeparatedElementsProvider] No syntax list found in parent",
			);
			return;
		}

		const syntaxList = elements[0];
		const children = syntaxList.getChildren();
		const commaIndex = children.findIndex((child) => child === commaToken);
		if (
			commaIndex === -1 ||
			commaIndex === 0 ||
			commaIndex === children.length - 1
		) {
			console.log(
				"[FlipCommaSeparatedElementsProvider] Invalid comma position:",
				{
					commaIndex,
					childrenLength: children.length,
				},
			);
			return;
		}

		// カンマの前後の要素を取得
		const prevElement = children[commaIndex - 1];
		const nextElement = children[commaIndex + 1];
		if (!(prevElement && nextElement)) {
			console.log(
				"[FlipCommaSeparatedElementsProvider] Missing elements around comma:",
				{
					hasPrevElement: !!prevElement,
					hasNextElement: !!nextElement,
				},
			);
			return;
		}

		// 要素のテキストを取得
		const prevText = prevElement.getText();
		const nextText = nextElement.getText();

		// 元の空白を保持
		const prevEnd = prevElement.getEnd();
		const commaStart = commaToken.getStart();
		const whitespaceBeforeComma = fullText.slice(prevEnd, commaStart);

		const commaEnd = commaToken.getEnd();
		const nextStart = nextElement.getStart();
		const whitespaceAfterComma = fullText.slice(commaEnd, nextStart);

		// 入れ替えた式を作成
		const flippedExpression = `${nextText}${whitespaceBeforeComma},${whitespaceAfterComma}${prevText}`;

		const localeResources = getLocaleResources(env.language);
		const action = new CodeAction(
			localeResources.flipCommaSeparatedElements(),
			CodeActionKind.QuickFix,
		);
		action.edit = new WorkspaceEdit();
		action.edit.replace(
			document.uri,
			new Range(
				document.positionAt(prevElement.getStart()),
				document.positionAt(nextElement.getEnd()),
			),
			flippedExpression,
		);
		return [action];
	}
}
