import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./src/index.ts"],
	clean: true,
	format: ["cjs"],
	sourcemap: true,
	external: ["vscode"],
});
