import { useMutation } from "convex/react";

import type { Id } from "_generated/dataModel";
import { api } from "_generated/api";

import { useTranslate } from "../translation";

import "./AddSubList.css";

const AddSubList = ({listId}: {listId: Id<"lists">}) => {
	const {t} = useTranslate();
	const add = useMutation(api.lists.add)
		.withOptimisticUpdate((localStore, {listId, name}) => {
			const itemId = `${Math.random()}` as Id<"items">;
			const item = {
				_id: itemId,
				_creationTime: Date.now(),
				isCompleted: false,
				listId,
				childListId: listId,
				value: name,
				isLoading: true,
			};
			const list = localStore.getQuery(api.lists.get, {listId});
			if (list) {
				localStore.setQuery(api.lists.get, {listId}, {
					...list,
					items: [...list.items, item],
				});
			}
		});

	return (
		<svg className="addSubList" viewBox="-10 -10 120 120" onClick={() => add({color: "blue", listId, name: t("newList")})}>
			<circle cx="50" cy="50" r="50"/>
			<path d="M 50 25 L 50 75 M 25 50 L 75 50"/>
		</svg>
	)
};

export default AddSubList;
