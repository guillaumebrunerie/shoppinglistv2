import { useMutation, useQuery } from "convex/react";
import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd";
import { api } from "../convex/_generated/api";
import { type Id } from "../convex/_generated/dataModel";
import AddSubList from "./AddSubList";
import AddItem from "./AddItem";
import Row from "./Row";

import "./List.css";
import { useTranslate } from "./translation";
import { useContext } from "react";
import { PageContext } from "./App";
import Header from "./Header";

const BackThing = () => (
	<svg className="backThing" viewBox="0 0 60 100">
		<path d="M 50 90 L 10 50 L 50 10"/>
	</svg>
)

const List = ({listId}: {listId: Id<"lists">, isLoading?: boolean}) => {
	const {t} = useTranslate();
	const {setListId} = useContext(PageContext);
	const list = useQuery(api.lists.get, {listId});

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

	if (!list) {
		console.log("No list");
		return null;
	}
	console.log("Yes list", list);

	const goBack = () => {
		if (list?.parentListId) {
			setListId(list.parentListId);
		}
	}

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination || result.source.index === result.destination.index) {
			return null;
		}
		reorder({listId, itemId: result.draggableId as Id<"items">, index: result.destination.index});
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<main>
				{list?.parentListId && <span className="backButton" onClick={goBack}><BackThing/>{t("back")}</span>}
				<Header list={list} doClean={() => {}}/>
				<Droppable droppableId={listId}>
					{provided => (
						<ul ref={provided.innerRef} {...provided.droppableProps}>
							{list?.parentId && <AddItem listId={listId}/>}
							{list?.items.map((item, i) => (
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
				{(!list?.parentId) && <AddSubList listId={listId}/>}
			</main>
		</DragDropContext>
	);
};

export default List;
