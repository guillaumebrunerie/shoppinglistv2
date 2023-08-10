import { useMutation } from "convex/react";
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd";
import { api } from "../convex/_generated/api";
import { type Id } from "../convex/_generated/dataModel";
import AddSubList from "./AddSubList";
import AddItem from "./AddItem";
import Row, { Item } from "./Row";

import "./List.css";
import Header from "./Header";
import Back from "./Back";

type List = {
	_id: Id<"lists">,
	isLoading: boolean,
	name: string,
	parentListId?: Id<"lists"> | null,
	parentId?: Id<"items">,
	items: Item[],
}

const List = ({list}: {list: List, isLoading?: boolean}) => {
	const listId = list._id;

	const reorder = useMutation(api.items.reorder).withOptimisticUpdate(
		(localStore, {listId, itemId, index}) => {
			const list = localStore.getQuery(api.lists.get, {listId});
			if (!list) {
				return;
			}
			const items = [...list.items];
			const item = items.find(item => item._id == itemId);
			if (!item) {
				return;
			}
			const indexFrom = items.findIndex(item => item._id == itemId);
			items.splice(indexFrom, 1);
			items.splice(index, 0, {...item, isLoading: true});
			localStore.setQuery(api.lists.get, {listId}, {...list, items});
		}
	);


	const handleDragEnd = (result: DropResult) => {
		if (!result.destination || result.source.index === result.destination.index) {
			return null;
		}
		reorder({listId, itemId: result.draggableId as Id<"items">, index: result.destination.index});
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<main>
				{list.parentListId && <Back listId={list.parentListId}/>}
				<Header list={list} doClean={() => {}}/>
				<Droppable droppableId={listId}>
					{provided => (
						<ul ref={provided.innerRef} {...provided.droppableProps}>
							{list.parentId && <AddItem listId={listId}/>}
							{list.items.map((item, i) => (
								<Draggable key={item._id} draggableId={item._id} index={i}>
									{(provided, snapshot) => (
										<Row
											provided={provided}
											isDragging={snapshot.isDragging}
											item={item}
											// isWaitingReorder={!!waitingReorder && waitingReorder.itemId == item.id}
											// isWaitingDelete={!!waitingIds && waitingIds.includes(item.id)}
										/>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</ul>
					)}
				</Droppable>
				{(!list.parentId) && <AddSubList listId={listId}/>}
			</main>
		</DragDropContext>
	);
};

export default List;
