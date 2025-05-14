import en from "./en";
import ja from "./ja";

export const getLocaleResources = (lang: string) => {
	for (const [availableLang, resources] of Object.entries({ en, ja })) {
		if (lang.startsWith(availableLang)) {
			return resources;
		}
	}

	// fallback
	return en;
};
