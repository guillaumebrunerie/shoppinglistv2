import { v } from "convex/values";
import { type Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const get = query({
	args: {listId: v.id("lists")},
	handler: async ({db}, {listId}) => {
		const list = await db.get(listId);
		if (!list) {
			return list;
		}
		const items = (await Promise.all(list.itemIds.map(async itemId => {
			const item = await db.get(itemId);
			if (!item || item.deletedAt) {
				return [];
			}
			if (item?.childListId) {
				item.value = (await db.get(item.childListId))?.name;
			}
			return [{
				...item,
				isLoading: false,
			}];
		}))).flat();
		const parentListId = list.parentId && (await db.get(list.parentId))?.listId || null;
		return {
			...list,
			isLoading: false,
			items,
			parentListId
		};
	},
});

export const getRecentlyDeleted = query({
	args: {listId: v.id("lists")},
	handler: async ({db}, {listId}) => {
		const list = await db.get(listId);
		if (!list) {
			return list;
		}
		const items = (await Promise.all(list.itemIds.map(async itemId => {
			const item = await db.get(itemId);
			if (!item || !item.deletedAt) {
				return [];
			}
			if (item?.childListId) {
				item.value = (await db.get(item.childListId))?.name;
			}
			return [{
				...item,
				isLoading: false,
			}];
		}))).flat();
		const parentListId = list.parentId && (await db.get(list.parentId))?.listId || null;
		return {
			...list,
			isLoading: false,
			items,
			parentListId
		};
	},
});

export const getNames = query({
	args: {listIds: v.array(v.string())},
	handler: async ({db}, {listIds}) => {
		const result: {[Key in Id<"lists">]?: string} = {};
		await Promise.all(listIds.map(async listId_ => {
			const listId = db.normalizeId("lists", listId_);
			if (!listId) {
				return;
			}
			const list = await db.get(listId);
			if (!list) {
				return;
			}
			result[listId] = list.name;
		}));
		return result;
	},
});

export const add = mutation({
	args: {listId: v.id("lists"), name: v.string(), color: v.string()},
	handler: async ({db}, {listId, name, color}) => {
		const childListId = await db.insert("lists", {name, itemIds: [], color});
		const itemId = await db.insert("items", {listId, childListId, isCompleted: false})
		await db.patch(childListId, {parentId: itemId});
		const list = await db.get(listId);
		await db.patch(listId, {itemIds: [...list!.itemIds, itemId]})
		return;
	},
});

export const rename = mutation({
	args: {listId: v.id("lists"), name: v.string()},
	handler: async({db}, {listId, name}) => {
		await db.patch(listId, {name});
	},
});

export const createIfNonExisting = mutation({
	args: {listIdOrName: v.string(), color: v.string()},
	handler: async ({db}, {listIdOrName, color}) => {
		const listId = db.normalizeId("lists", listIdOrName);
		if (listId && await db.get(listId)) {
			return listId;
		} else {
			return await db.insert("lists", {name: listIdOrName, itemIds: [], color});
		}
	},
});

export const clean = mutation({
	args: {listId: v.id("lists")},
	handler: async ({db}, {listId}) => {
		const list = await db.get(listId);
		if (!list) {
			return;
		}
		await Promise.all(list.itemIds.map(async itemId => {
			const item = await db.get(itemId);
			if (item?.isCompleted) {
				await db.patch(itemId, {deletedAt: Date.now()});
			}
		}));
	},
})
