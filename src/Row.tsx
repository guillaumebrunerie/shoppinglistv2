import { type Id } from "../convex/_generated/dataModel";
import classNames from "classnames";

import "./Row.css";
import { useContext, useState } from "react";
import { PageContext } from "./App";
import DeleteButton from "./Delete";
import EditButton from "./Edit";
import { api } from "../convex/_generated/api";
import { useMutation } from "convex/react";

type Item = {
	_id: Id<"items">,
	listId: Id<"lists">,
	childListId?: Id<"lists">,
	isCompleted: boolean,
	value: string,
	isLoading: boolean,
}

const Row = ({item, provided, isDragging}: {item: Item, provided: any, isDragging: boolean}) => {
	// const navigate = useNavigate();

	// // Toggling checked state
	// const [waitingCheck, doCheck] = useOptimisticAction(
	// 	() => {
	// 		if (isEditing) return null;
	// 		if (isSubList) {
	// 			navigate(`/${item.childList?.id}`)
	// 			return null;
	// 		}
	// 		return {action: `${item.listId}/toggle`, id: item.id, currentState: `${completed}`};
	// 	},
	// 	item.listId,
	// );
	// let completed = !isSubList && item.completed;
	// if (waitingCheck) {
	// 	completed = waitingCheck.currentState === "false"
	// }

	// Editing item
	const [isEditing, setIsEditing] = useState(false);
	// const [waitingEdit, doEdit] = useOptimisticAction(
	// 	(value: string) => {
	// 		setIsEditing(false);
	// 		if (!value || value === item.value) return null;
	// 		if (isSubList) {
	// 			return {action: `${item.childListId}/rename`, id: "", value};
	// 		} else {
	// 			return {action: `${item.listId}/edit`, id: item.id, value};
	// 		}
	// 	},
	// 	item.listId,
	// );
	// let value = (isSubList ? item.childList?.name : item?.value) as string;
	// if (waitingEdit) {
	// 	value = waitingEdit.value as string;
	// }
	// const handleBlur = (event: React.FocusEvent) => {
	// 	doEdit((event.target as HTMLInputElement).value.trim());
	// }
	// const handleKeyUp = (event: React.KeyboardEvent) => {
	// 	if (event.key == "Enter") {
	// 		doEdit((event.target as HTMLInputElement).value.trim());
	// 	}
	// }
	const startEdit = (event: React.MouseEvent) => {
		setIsEditing(true);
		((event.target as Element).parentNode as Element)?.scrollTo(0, 0)
	}

	// // Deleting item
	// const [waitingDelete, doDelete] = useOptimisticAction(
	// 	() => ({action: `${item.listId}/delete`, id: item.id}),
	// 	item.listId,
	// );

	// if (isWaitingDelete || waitingDelete) {
	// 	return (
	// 		<SRow
	// 			$isCompleted={completed}
	// 			$isWaiting={!!waitingCheck || !!waitingEdit}
	// 			$isWaitingDelete
	// 		/>
	// 	);
	// }

	const {_id: itemId, value, isLoading, isCompleted, childListId, listId} = item;

	const {setListId} = useContext(PageContext);

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

	const handleClick = () => {
		if (item.childListId) {
			setListId(item.childListId);
		} else {
			toggleCompletion({itemId, isCompleted})
		}
	};
	const doDelete = () => {
		deleteItem({itemId});
	};

	const doEdit = (value: string) => {
		setIsEditing(false);
		if (!value || value === item.value) return;
		if (childListId) {
			renameList({listId: childListId, name: value});
		} else {
			editItem({itemId, value});
		}
	}

	const handleBlur = (event: React.FocusEvent) => {
		doEdit((event.target as HTMLInputElement).value.trim());
	}
	const handleKeyUp = (event: React.KeyboardEvent) => {
		if (event.key == "Enter") {
			doEdit((event.target as HTMLInputElement).value.trim());
		}
	}

	return (
		<li
			ref={provided.innerRef}
			{...isEditing ? {} : provided.draggableProps}
			{...isEditing ? {} : provided.dragHandleProps}
			className={classNames({
				isCompleted,
				isLoading,
				isSubList: !!childListId,
				isDragging,
			})}
			onPointerDown={() => isEditing || (document.activeElement as HTMLElement | null)?.blur()}
		>
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
