import { useState } from "react";
import classNames from "classnames";
import type { DraggableProvided } from "@hello-pangea/dnd";

import type { Id } from "_generated/dataModel";

import DeleteButton from "./Delete";
import EditButton from "./Edit";

import "./Row.css";
import ListQuery from "./ListQuery";

export type Item = {
	childListId?: Id<"lists">,
	isCompleted: boolean,
	value: string,
	isLoading?: boolean,
	deletedAt?: number,
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
			{childListId && <ListQuery listId={childListId}/>}
			<span className={classNames({itemText: true, isLoading, isCompleted})} onClick={isEditing ? () => {} : onClick}>
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
