import { useContext, useState, type ReactNode, createContext } from "react";

export const supportedLanguages = ["fr", "en", "ru"] as const;
export type Lang = typeof supportedLanguages[number];

const translations = {
	newList: {
		fr: "Nouvelle liste",
		en: "New list",
		ru: "Новый список",
	},
	add: {
		fr: "Ajouter…",
		en: "Add…",
		ru: "Добавить…",
	},
	clearList: {
		fr: "Nettoyer la liste",
		en: "Clean up list",
		ru: "Очистить список",
	},
	recentlyDeleted: {
		fr: "Supprimés récemment",
		en: "Recently deleted",
		ru: "Удаленные",
	},
	back: {
		fr: "Retour",
		en: "Back",
		ru: "Обратно",
	},
	backToAllLists: {
		fr: "Retourner à mes listes",
		en: "Back to my lists",
		ru: "Back to my lists", // TODO
	},
	allMyLists: {
		fr: "Mes listes de listes",
		en: "My lists of lists",
		ru: "My lists of lists", // TODO
	},
	copyListId: {
		fr: "Partager",
		en: "Share",
		ru: "Share", // TODO
	},
	createOrJoin: {
		fr: "Créer / rejoindre une liste",
		en: "Create / join a list",
		ru: "Create / join a list", // TODO
	},
	locale: {
		fr: "fr-FR",
		en: "en-US",
		ru: "ru-RU",
	},
	date: {
		fr: "le %s",
		en: "on %s",
		ru: "%s",
	},
	flag: {
		fr: "🇫🇷",
		en: "🇬🇧",
		ru: "🇷🇺",
	},
} as const;
type TranslationKey = keyof (typeof translations)

export const flag = (lang: Lang) => translations.flag[lang];

const context = createContext<[Lang, (l: Lang) => void]>(["fr", () => {}]);

type ProviderProps = {
	children: ReactNode;
};

const getLanguage = (): Lang => {
	const lang = localStorage.getItem("lang");
	if (lang && supportedLanguages.includes(lang as Lang)) {
		return lang as Lang;
	}
	return "fr";
};

export const LangProvider = ({ children }: ProviderProps) => {
	const langState = useState(getLanguage());
	return <context.Provider value={langState}>{children}</context.Provider>;
};

export const useTranslate = () => {
	const [lang] = useContext(context);
	return {
		lang,
		t: (key: TranslationKey): string => translations[key][lang],
	}
};

export const useSetLanguage = () => {
	const [, setLanguage] = useContext(context);
	return (lang: Lang) => {
		setLanguage(lang);
		localStorage.setItem("lang", lang);
	};
};
