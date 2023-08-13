import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { DraggableProvided } from "@hello-pangea/dnd";

import { api } from "_generated/api";
import { type Id } from "_generated/dataModel";

import { getKnownListIds, removeKnownListId } from "../localLists";
import Row from "./Row";

type Item = {
	childListId: Id<"lists">,
	value: string,
	isCompleted: false,
};

const ListOfListsRow = ({item, provided, isDragging}: {item: Item, provided: DraggableProvided, isDragging: boolean}) => {
	const navigate = useNavigate();

	const handleClick = () => {
		if (item.childListId) {
			navigate(`/lists/${item.childListId}`);
		}
	};

	const renameList = useMutation(api.lists.rename)
		.withOptimisticUpdate((localStore, {listId, name}) => {
			const listIds = getKnownListIds();
			const names = localStore.getQuery(api.lists.getNames, {listIds});
			if (names) {
				localStore.setQuery(api.lists.getNames, {listIds}, {
					...names,
					[listId]: name,
				});
			}
		})

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

export default ListOfListsRow;
