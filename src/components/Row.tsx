import { useState } from "react";
import classNames from "classnames";
import { DraggableProvided } from "@hello-pangea/dnd";
import { useQuery } from "convex/react";

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

type RowProps = {
	item: Item,
	onClick: () => void,
	onEdit: (value: string) => void,
	onDelete: () => void,
	provided: DraggableProvided,
	isDragging: boolean,
}

const Row = ({item, provided, isDragging, onClick, onEdit, onDelete}: RowProps) => {
	const {value, isLoading, isCompleted, childListId, deletedAt} = item;

	const [isEditing, setIsEditing] = useState(false);
	const startEdit = (event: React.MouseEvent) => {
		setIsEditing(true);
		((event.target as Element).parentNode as Element)?.scrollTo(0, 0)
	};

	const doEdit = (value: string) => {
		value = value.trim();
		setIsEditing(false);
		if (!value || value === item.value) return;
		onEdit(value);
	};

	const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		doEdit(event.target.value);
	};

	const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key == "Enter") {
			doEdit(event.currentTarget.value);
		}
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
			<span className={classNames({itemText: true, isLoading, isCompleted})} onClick={onClick}>
				{isEditing
					? <input className="edit" autoFocus enterKeyHint="done" defaultValue={value} onKeyUp={handleKeyUp} onBlur={handleBlur}/>
					: value
				}
			</span>
			<DeleteButton onClick={onDelete} isCompleted={isCompleted}/>
			<EditButton onClick={startEdit} isCompleted={isCompleted}/>
		</li>
	);
};

export default Row;
