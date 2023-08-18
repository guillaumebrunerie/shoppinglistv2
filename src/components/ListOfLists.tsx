import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";

import type { Id } from "_generated/dataModel";

import ListOfListsRow from "./ListOfListsRow";
import { useTranslate } from "../translation";
import { reorderKnownListIds } from "../localLists";
import CreateOrJoinListOfLists from "./CreateOrJoinListOfLists";
import MenuButton from "./MenuButton";
import LanguagePicker from "./LanguagePicker";

type List = {
	items: {
		childListId: Id<"lists">,
		isCompleted: false,
	}[],
};

const ListOfLists = ({list}: {list: List}) => {
	const {t} = useTranslate();

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination || result.source.index === result.destination.index) {
			return;
		}
		reorderKnownListIds(result.draggableId as Id<"lists">, result.destination.index);
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<main className="listOfLists">
				<div className="header">
					<span className="name">
						{t("allMyLists")}
					</span>
					<MenuButton>
						{closeMenu => <LanguagePicker closeMenu={closeMenu}/>}
					</MenuButton>
				</div>
				<Droppable droppableId="listOfLists">
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
				<CreateOrJoinListOfLists/>
			</main>
		</DragDropContext>
	);
};

export default ListOfLists;
