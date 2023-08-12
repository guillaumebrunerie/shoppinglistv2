import { DragDropContext, Draggable, DropResult, Droppable } from "@hello-pangea/dnd";

import { type Id } from "_generated/dataModel";

import { List } from "./List";
import ListOfListsRow from "./ListOfListsRow";
import { useTranslate } from "../translation";
import { reorderKnownListIds } from "../localLists";

const ListOfLists = ({list}: {list: List}) => {
	const listId = list._id;
	const {t} = useTranslate();

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination || result.source.index === result.destination.index) {
			return;
		}
		reorderKnownListIds(result.draggableId as Id<"lists">, result.destination.index);
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<main>
				<div className="header">
					<span className="name">
						{t("allMyLists")}
					</span>
				</div>
				<Droppable droppableId={listId}>
					{provided => (
						<ul ref={provided.innerRef} {...provided.droppableProps}>
							{list.items.map((item, i) => (
								<Draggable key={item.childListId} draggableId={item.childListId || ""} index={i}>
									{(provided, snapshot) => (
										<ListOfListsRow
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
			</main>
		</DragDropContext>
	);
};

export default ListOfLists;
