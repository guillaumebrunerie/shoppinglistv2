import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import type { DraggableProvided } from "@hello-pangea/dnd";

import { api } from "_generated/api";
import type { ConnectedItem } from "../../convex/lists";

import Row from "./Row";

type ConnectedRowProps = {
	item: ConnectedItem,
	provided: DraggableProvided,
	isDragging: boolean,
}

const ConnectedRow = ({item, provided, isDragging}: ConnectedRowProps) => {
	const {_id: itemId, isCompleted, childListId, listId} = item;

	// Mutations

	const toggleCompletion = useMutation(api.items.toggleCompletion)
		.withOptimisticUpdate((localStore, {itemId, isCompleted}) => {
			const current = localStore.getQuery(api.lists.get, {listId});
			if (current) {
				const newItems = current.items.map(item => (
					item?._id == itemId ? {...item, isCompleted: !isCompleted, isLoading: true} : item
				))
				localStore.setQuery(api.lists.get, {listId}, {
					...current,
					items: newItems,
				})
			}
		});

	const editItem = useMutation(api.items.edit)
		.withOptimisticUpdate((localStore, {itemId, value}) => {
			const list = localStore.getQuery(api.lists.get, {listId});
			if (list) {
				localStore.setQuery(api.lists.get, {listId}, {
					...list,
					items: list.items.map(item => item?._id == itemId ? {...item, value, isLoading: true} : item)
				});
			}
		});

	const deleteItem = useMutation(api.items.remove)
		.withOptimisticUpdate((localStore, {itemId}) => {
			const list = localStore.getQuery(api.lists.get, {listId});
			if (list) {
				localStore.setQuery(api.lists.get, {listId}, {
					...list,
					items: list.items.map(item => item?._id == itemId ? {...item, deletedAt: Date.now()} : item)
				});
			}
		});

	const renameList = useMutation(api.lists.rename)
		.withOptimisticUpdate((localStore, {listId: childListId, name}) => {
			const list = localStore.getQuery(api.lists.get, {listId});
			if (list) {
				localStore.setQuery(api.lists.get, {listId}, {
					...list,
					items: list.items.map(item => item?.childListId == childListId ? {...item, value: name, isLoading: true} : item)
				});
			}
		});

	// Clicking on items

	const navigate = useNavigate();

	const handleClick = () => {
		if (item.childListId) {
			navigate(`/lists/${item.childListId}`);
		} else {
			toggleCompletion({itemId, isCompleted})
		}
	};

	const handleEdit = (value: string) => {
		if (childListId) {
			renameList({listId: childListId, name: value});
		} else {
			editItem({itemId, value});
		}
	}

	const handleDelete = () => {
		deleteItem({itemId});
	}

	return (
		<Row
			onClick={handleClick}
			onEdit={handleEdit}
			onDelete={handleDelete}
			item={item}
			provided={provided}
			isDragging={isDragging}
		/>
	);
}

export default ConnectedRow;
