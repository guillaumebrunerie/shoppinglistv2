import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const add = mutation({
	args: {listId: v.id("lists"), value: v.string()},
	handler: async ({db}, {listId, value}) => {
		const list = await db.get(listId);
		if (!list) {
			console.error("Could not find list");
			return;
		}
		const itemId = await db.insert("items", {listId, value, isCompleted: false})
		await db.patch(listId, {itemIds: [...list.itemIds, itemId]})
	},
});

export const toggleCompletion = mutation({
	args: {itemId: v.id("items"), isCompleted: v.boolean()},
	handler: async ({db}, {itemId, isCompleted}) => {
		await db.patch(itemId, {isCompleted: !isCompleted});
	},
});

export const edit = mutation({
	args: {itemId: v.id("items"), value: v.string()},
	handler: async ({db}, {itemId, value}) => {
		await db.patch(itemId, {value});
	},
});

export const remove = mutation({
	args: {itemId: v.id("items")},
	handler: async ({db}, {itemId}) => {
		await db.patch(itemId, {deletedAt: Date.now()});
	},
});

export const reorder = mutation({
	args: {listId: v.id("lists"), itemId: v.id("items"), index: v.number()},
	handler: async ({db}, {listId, itemId, index}) => {
		const list = await db.get(listId);
		if (!list) {
			return;
		}
		const items = await Promise.all(list.itemIds.map(async itemId => {
			return await db.get(itemId);
		}));
		const itemIdTo = items.filter(item => item && !item.deletedAt)[index]?._id;
		const indexFrom = list.itemIds.indexOf(itemId);
		const indexTo = items.findIndex(item => item?._id == itemIdTo);
		const itemIds = [...list.itemIds];
		itemIds.splice(indexFrom, 1);
		itemIds.splice(indexTo, 0, itemId);
		console.log({itemIds});
		await db.patch(listId, {
			itemIds,
		});
	},
})
