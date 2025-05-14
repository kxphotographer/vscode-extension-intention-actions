import { CodeActionKind, type ExtensionContext, languages } from "vscode";
import {
	FlipBinaryExpressionProvider,
	FlipCommaSeparatedElementsProvider,
} from "./providers";

export function activate(context: ExtensionContext) {
	context.subscriptions.push(
		languages.registerCodeActionsProvider(
			"typescript",
			new FlipBinaryExpressionProvider(),
			{
				providedCodeActionKinds: [CodeActionKind.QuickFix],
			},
		),
		languages.registerCodeActionsProvider(
			"typescriptreact",
			new FlipBinaryExpressionProvider(),
			{
				providedCodeActionKinds: [CodeActionKind.QuickFix],
			},
		),
		languages.registerCodeActionsProvider(
			"typescript",
			new FlipCommaSeparatedElementsProvider(),
			{
				providedCodeActionKinds: [CodeActionKind.QuickFix],
			},
		),
		languages.registerCodeActionsProvider(
			"typescriptreact",
			new FlipCommaSeparatedElementsProvider(),
			{
				providedCodeActionKinds: [CodeActionKind.QuickFix],
			},
		),
	);
}
