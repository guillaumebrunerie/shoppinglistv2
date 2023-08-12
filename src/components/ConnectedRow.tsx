import { DraggableProvided } from "@hello-pangea/dnd";
import Row, { Item } from "./Row";
import { useMutation } from "convex/react";
import { api } from "_generated/api";
import { useNavigate } from "react-router-dom";

const ConnectedRow = ({item, provided, isDragging}: {item: Item, provided: DraggableProvided, isDragging: boolean}) => {
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
