import { useMutation } from "convex/react";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";

import { api } from "_generated/api";
import { type Id } from "_generated/dataModel";
import type { ConnectedList } from "../../convex/lists";

import AddSubList from "./AddSubList";
import AddItem from "./AddItem";
import Header from "./Header";
import Back from "./Back";
import ConnectedRow from "./ConnectedRow";

import "./List.css";
import { useEffect } from "react";
import { setLastListId } from "../localLists";

const List = ({list}: {list: ConnectedList}) => {
	const listId = list._id;

	useEffect(() => {
		if (!list.parentListId) {
			setLastListId(listId);
		}
	}, [list.parentListId, listId]);

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

	const clean = useMutation(api.lists.clean).withOptimisticUpdate(
		(localStore, {listId}) => {
			const list = localStore.getQuery(api.lists.get, {listId});
			if (list) {
				localStore.setQuery(api.lists.get, {listId}, {
					...list,
					items: list.items.map(item => item.isCompleted ? {
						...item,
						deletedAt: Date.now(),
					} : item),
				});
			}
		}
	);

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination || result.source.index === result.destination.index) {
			return null;
		}
		reorder({listId, itemId: result.draggableId as Id<"items">, index: result.destination.index});
	}

	const doClean = () => {
		clean({listId});
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<main>
				{list.parentListId && <Back listId={list.parentListId}/>}
				<Header list={list} doClean={doClean}/>
				<Droppable droppableId={listId}>
					{provided => (
						<ul ref={provided.innerRef} {...provided.droppableProps}>
							{list.parentListId && <AddItem listId={listId}/>}
							{list.items.map((item, i) => (
								<Draggable key={item._id} draggableId={item._id} index={i}>
									{(provided, snapshot) => (
										<ConnectedRow
											provided={provided}
											isDragging={snapshot.isDragging}
											item={item}
										/>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</ul>
					)}
				</Droppable>
				{(!list.parentListId) && <AddSubList listId={listId}/>}
			</main>
		</DragDropContext>
	);
};

export default List;
