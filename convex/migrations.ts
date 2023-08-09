// import { mutation } from "./_generated/server";
// import { type Id } from "./_generated/dataModel";
// import listData from "./originalListData";
// import itemData from "./originalItemData";

// export const importAll = mutation({
// 	handler: async ({db}) => {
// 		// Insert the lists
// 		const listIdsMap = new Map<string, Id<"lists">>();
// 		for (const listRow of listData) {
// 			const id = await db.insert("lists", {
// 				color: listRow.color,
// 				name: listRow.name,
// 				itemIds: [], // TODO
// 				originalId: listRow.id,
// 				parentId: undefined, // TODO
// 			});
// 			listIdsMap.set(listRow.id, id);
// 		}

// 		// Insert the items
// 		const itemIdsMap = new Map<string, Id<"items">>();
// 		const childListIds = new Map<Id<"lists">, Id<"items">>();
// 		for (const itemRow of itemData) {
// 			const listId = listIdsMap.get(itemRow.listId);
// 			if (!listId) {
// 				continue;
// 			}
// 			const childListId = itemRow.childListId ? listIdsMap.get(itemRow.childListId) : undefined;
// 			const id = await db.insert("items", {
// 				isCompleted: itemRow.completed == 1,
// 				listId,
// 				childListId,
// 				originalId: itemRow.id,
// 				value: itemRow.value || undefined,
// 			});
// 			itemIdsMap.set(itemRow.id, id);
// 			if (childListId) {
// 				childListIds.set(childListId, id);
// 			}
// 		}

// 		// Fix the lists
// 		for (const listRow of listData) {
// 			const listId = listIdsMap.get(listRow.id);
// 			if (!listId) {
// 				continue;
// 			}
// 			const items = itemData.filter(item => item.listId == listRow.id);
// 			items.sort((a, b) => a.order.localeCompare(b.order));
// 			const itemIds = items.map(item => itemIdsMap.get(item.id)!);
// 			const parentId = childListIds.get(listId);
// 			await db.patch(listId, {
// 				itemIds,
// 				parentId,
// 			});
// 		}
// 	}
// });
