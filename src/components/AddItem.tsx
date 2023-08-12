import { useState } from "react";
import { useMutation } from "convex/react";

import { type Id } from "_generated/dataModel";
import { api } from "_generated/api";

import { useTranslate } from "../translation";

import "./AddItem.css";

const AddItem = ({listId}: {listId: Id<"lists">}) => {
	const {t} = useTranslate();
	// const params = useParams();
	// const listId = params.listId as string;
	const [text, setText] = useState("");

	// const [waitingAdd, doAdd] = useOptimisticAction(
	// 	(value: string) => {
	// 		if (!value) return null;
	// 		setText("");
	// 		return {action: `${listId}/add`, value};
	// 	},
	// 	listId,
	// );

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

	const handleChange = (event: React.ChangeEvent) => {
		setText((event.target as HTMLInputElement).value);
	};
	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			const value = event.currentTarget.value.trim();
			if (value) {
				add({listId, value});
				setText("");
			}
		}
	};

	return (
		<>
			<li // $fontSize="1rem"
			>
				<input
					type="text"
					enterKeyHint="done"
					placeholder={t("add")}
					value={text}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
				/>
			</li>
		</>
	);
};

export default AddItem;