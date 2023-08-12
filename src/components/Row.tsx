import { useState } from "react";
import classNames from "classnames";
import { DraggableProvided } from "@hello-pangea/dnd";
import { useMutation, useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";

import DeleteButton from "./Delete";
import EditButton from "./Edit";
import { api } from "_generated/api";
import { type Id } from "_generated/dataModel";

import "./Row.css";

export type Item = {
	_id: Id<"items">,
	listId: Id<"lists">,
	childListId?: Id<"lists">,
	isCompleted: boolean,
	value?: string,
	isLoading: boolean,
	deletedAt?: number,
};

const ChildListQuery = ({listId}: {listId: Id<"lists">}) => {
	useQuery(api.lists.get, {listId});
	return null;
};

const Row = ({item, provided, isDragging}: {item: Item, provided: DraggableProvided, isDragging: boolean}) => {
	const {_id: itemId, value, isLoading, isCompleted, childListId, listId, deletedAt} = item;

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
					items: list.items.map(item => item?._id == itemId ? {...item, deletedAt: Date.now(), isLoading: true} : item)
				});
			}
		});

	const renameList = useMutation(api.lists.rename)
		.withOptimisticUpdate((localStore, {listId, name}) => {
			const list = localStore.getQuery(api.lists.get, {listId});
			if (list) {
				localStore.setQuery(api.lists.get, {listId}, {
					...list,
					name,
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

	// Editing items

	const [isEditing, setIsEditing] = useState(false);
	const startEdit = (event: React.MouseEvent) => {
		setIsEditing(true);
		((event.target as Element).parentNode as Element)?.scrollTo(0, 0)
	};

	const doEdit = (value: string) => {
		value = value.trim();
		setIsEditing(false);
		if (!value || value === item.value) return;
		if (childListId) {
			renameList({listId: childListId, name: value});
		} else {
			editItem({itemId, value});
		}
	};

	const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		doEdit(event.target.value);
	};

	const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key == "Enter") {
			doEdit(event.currentTarget.value);
		}
	};

	// Deleting items

	const doDelete = () => {
		deleteItem({itemId});
	};

	return (
		<li
			ref={provided.innerRef}
			{...isEditing ? {} : provided.draggableProps}
			{...isEditing ? {} : provided.dragHandleProps}
			className={classNames({
				isCompleted,
				isLoading,
				isDeleted: !!deletedAt,
				isSubList: !!childListId,
				isDragging,
			})}
			onPointerDown={() => isEditing || (document.activeElement as HTMLElement | null)?.blur()}
		>
			{childListId && <ChildListQuery listId={childListId}/>}
			<span className={classNames({itemText: true, isLoading, isCompleted})} onClick={handleClick}>
				{isEditing
					? <input className="edit" autoFocus enterKeyHint="done" defaultValue={value} onKeyUp={handleKeyUp} onBlur={handleBlur}/>
					: value
				}
			</span>
			<DeleteButton onClick={doDelete} isCompleted={isCompleted}/>
			<EditButton onClick={startEdit} isCompleted={isCompleted}/>
		</li>
	);
};

export default Row;
