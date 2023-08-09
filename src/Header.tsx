import { useState } from "react";
import { Lang, flag, supportedLanguages, useSetLanguage, useTranslate } from "./translation";
import classNames from "classnames";

import "./Header.css";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

const Header = ({list, doClean}: {list: HalfList, doClean: () => void}) => {
	const {t, lang} = useTranslate();

	const {_id: listId} = list;

	// const [waiting, doRename] = useOptimisticAction(
	// 	(value: string) => {
	// 		setIsEditing(false);
	// 		if (!value || value === list.name) return null;
	// 		return {action: `${list.id}/rename`, value};
	// 	},
	// 	list.id,
	// )
	// const name = waiting?.value as string ?? list.name;

	const [isEditing, setIsEditing] = useState(false);

	const renameList = useMutation(api.lists.rename)
		.withOptimisticUpdate((localStore, {listId, name}) => {
			const list = localStore.getQuery(api.lists.get, {listId});
			if (list) {
				localStore.setQuery(api.lists.get, {listId}, {
					...list,
					name,
					isLoading: true,
				});
			}
		});

	const doRename = (name: string) => {
		setIsEditing(false);
		if (name) {
			renameList({listId, name});
		}
	}

	const handleBlur = (event: React.FocusEvent) => {
		doRename((event.target as HTMLInputElement).value.trim());
	}

	const handleKeyUp = (event: React.KeyboardEvent) => {
		if (event.key == "Enter") {
			doRename((event.target as HTMLInputElement).value.trim());
		}
	}

	const [isOpen, setIsOpen] = useState(false);
	const openMenu = () => setIsOpen(true);
	const closeMenu = () => setIsOpen(false);

	const handleClean = () => {
		closeMenu();
		doClean();
	}

	const handleBackToAllLists = () => {
		localStorage.removeItem("lastList");
		navigate("/", {replace: true});
	}

	const setLanguage = useSetLanguage();

	const handleSetLanguage = (lang: Lang) => () => {
		setLanguage(lang);
		closeMenu();
	}

	if (!list) {
		return null;
	}

	return (
		<div className="header">
			<span className={classNames({name: true, isLoading: list.isLoading})}>
				{isEditing ? <input autoFocus enterKeyHint="done" defaultValue={list.name} onKeyUp={handleKeyUp} onBlur={handleBlur}/> : <span onClick={() => setIsEditing(true)}>{list.name}</span>}
			</span>
			<div className="menuButton">
				<span onClick={openMenu}>{"\u2807"}</span>
				{isOpen && (
					<div className="menu">
						<div className="menuItem" onClick={handleBackToAllLists}>
							{t("backToAllLists")}
						</div>
						<div className="menuItem" onClick={handleClean}>
							{t("clearList")}
						</div>
						<div className="menuItem">
							<span onClick={() => {}}>{t("recentlyDeleted")}</span>
						</div>
						<div className="flagMenuItem">
							{supportedLanguages.map(thisLang => (
								<div
									className={classNames({flag: true, isSelected: thisLang == lang})}
									key={thisLang}
									onClick={handleSetLanguage(thisLang)}
								>
									{flag(thisLang)}
								</div>
							))}
						</div>
					</div>
				)}
				{isOpen && <div className="backdrop" onClick={closeMenu}/>}
			</div>
		</div>
	);
};

export default Header;
