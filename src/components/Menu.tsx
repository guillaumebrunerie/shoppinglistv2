import { Link, useNavigate } from "react-router-dom";
import { useTranslate } from "../translation";
import type { Id } from "_generated/dataModel";
import { getKnownListIds, unsetLastListId } from "../localLists";
import { useMutation, useQuery } from "convex/react";
import { api } from "_generated/api";
import LanguagePicker from "./LanguagePicker";
import ListQuery from "./ListQuery";

type MenuProps = {
	listId: Id<"lists">,
	closeMenu: () => void,
};

const Menu = ({listId, closeMenu}: MenuProps) => {
	const {t} = useTranslate();

	const clean = useMutation(api.lists.clean).withOptimisticUpdate(
		(localStore, {listId}) => {
			const list = localStore.getQuery(api.lists.get, {listId});
			if (list) {
				localStore.setQuery(api.lists.get, {listId}, {
					...list,
					items: list.items.map(item => item.isCompleted ? {
						...item,
						deletedAt: Date.now(),
					} : item),
				});
			}
		}
	);

	const doClean = () => {
		clean({listId});
	}

	const handleClean = () => {
		closeMenu();
		doClean();
	};

	const navigate = useNavigate();

	const handleBackToAllLists = () => {
		unsetLastListId();
		navigate("/");
	};

	const handleCopyListId = async () => {
		await navigator.clipboard.writeText(listId);
		closeMenu();
	};

	useQuery(api.lists.getRecentlyDeleted, {listId});
	const knownLists = getKnownListIds();

	return (
		<>
			{knownLists.map(listId => <ListQuery key={listId} listId={listId}/>)}
			<div className="menuItem" onClick={handleBackToAllLists}>
				{t("backToAllLists")}
			</div>
			<div className="menuItem" onClick={handleClean}>
				{t("clearList")}
			</div>
			<div className="menuItem">
				<Link to="recentlyDeleted">{t("recentlyDeleted")}</Link>
			</div>
			<div className="menuItem">
				<span onClick={handleCopyListId}>{t("copyListId")}</span>
			</div>
			<LanguagePicker closeMenu={closeMenu}/>
		</>
	)
};

export default Menu;
