import { useMutation } from "convex/react";

import type { Id } from "_generated/dataModel";
import { api } from "_generated/api";

import { useTranslate } from "../translation";

import Input from "./Input";

const AddItem = ({listId}: {listId: Id<"lists">}) => {
	const {t} = useTranslate();

	const add = useMutation(api.items.add)
		.withOptimisticUpdate((localStore, {value, listId}) => {
			const itemId = `${Math.random()}` as Id<"items">;
			const item = {
				_id: itemId,
				_creationTime: Date.now(),
				isCompleted: false,
				listId,
				value,
				isLoading: true,
			};
			const currentValue = localStore.getQuery(api.lists.get, {listId});
			if (currentValue) {
				localStore.setQuery(
					api.lists.get,
					{listId},
					{
						...currentValue,
						items: [item, ...currentValue.items],
					},
				);
			}
		});

	return (
		<Input
			placeholder={t("add")}
			onSubmit={value => add({listId, value})}
		/>
	)
};

export default AddItem;
