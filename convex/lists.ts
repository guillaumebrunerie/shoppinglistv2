import type { DatabaseReader } from "convex/server";
import { v } from "convex/values";

import type { DataModel, Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export type ConnectedItem = {
	_id: Id<"items">,
	listId: Id<"lists">,
	childListId?: Id<"lists">,
	isCompleted: boolean,
	value: string,
	isLoading?: boolean,
	deletedAt?: number,
};

export type ConnectedList = {
	_id: Id<"lists">,
	name: string,
	isLoading: boolean,
	items: ConnectedItem[],
	parentListId: Id<"lists"> | null,
};

const getItemValue = async (
	db: DatabaseReader<DataModel>,
	{value, childListId}: Doc<"items">,
) => {
	if (value) {
		return value;
	}
	if (childListId) {
		const childList = await db.get(childListId);
		if (childList) {
			return childList.name;
		}
	}
	return "unknown";
};

export const get = query({
	args: {listId: v.id("lists")},
	handler: async ({db}, {listId}): Promise<ConnectedList | null> => {
		const list = await db.get(listId);
		if (!list) {
			return list;
		}
		const items = (await Promise.all(list.itemIds.map(async itemId => {
			const item = await db.get(itemId);
			if (!item || item.deletedAt) {
				return [];
			}
			return [{
				...item,
				isLoading: false,
				value: await getItemValue(db, item),
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
	handler: async ({db}, {listId}): Promise<ConnectedList | null> => {
		const list = await db.get(listId);
		if (!list) {
			return list;
		}
		const items = (await Promise.all(list.itemIds.map(async itemId => {
			const item = await db.get(itemId);
			if (!item || !item.deletedAt) {
				return [];
			}
			return [{
				...item,
				isLoading: false,
				value: await getItemValue(db, item),
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
});
