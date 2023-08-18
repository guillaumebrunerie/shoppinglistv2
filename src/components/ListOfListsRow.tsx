import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import type { DraggableProvided } from "@hello-pangea/dnd";

import { api } from "_generated/api";
import type { Id } from "_generated/dataModel";

import { removeKnownListId } from "../localLists";
import Row from "./Row";

type Item = {
	childListId: Id<"lists">,
	isCompleted: false,
};

type ListOfListsRowProps = {
	item: Item,
	provided: DraggableProvided,
	isDragging: boolean,
};

const ListOfListsRow = ({item, provided, isDragging}: ListOfListsRowProps) => {
	const navigate = useNavigate();

	const handleClick = () => {
		if (item.childListId) {
			navigate(`/lists/${item.childListId}`);
		}
	};

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

	const handleEdit = (name: string) => {
		if (item.childListId) {
			renameList({listId: item.childListId, name});
		}
	};

	const handleDelete = () => {
		if (item.childListId) {
			removeKnownListId(item.childListId);
		}
	};

	const name = useQuery(api.lists.get, {listId: item.childListId})?.name;
	if (!name) {
		return null;
	}

	return (
		<Row
			onClick={handleClick}
			onEdit={handleEdit}
			onDelete={handleDelete}
			item={{...item, value: name}}
			provided={provided}
			isDragging={isDragging}
		/>
	);
}

export default ListOfListsRow;
