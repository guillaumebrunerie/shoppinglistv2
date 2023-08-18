import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const removeOrphanLists = internalMutation({
	handler: async ({db}) => {
		const lists = await db.query("lists").collect();
		let n = 0;
		await Promise.all(lists.map(async list => {
			if (!list.parentId) {
				return;
			}
			const item = await db.get(list.parentId);
			if (!item) {
				await db.delete(list._id);
				n++;
			}
		}));
		console.log(`${n} list${n == 1 ? "" : "s"} deleted`);
	},
});

export const removeEmptyRootLists = internalMutation({
	handler: async ({db}) => {
		const lists = await db.query("lists").collect();
		let n = 0;
		await Promise.all(lists.map(async list => {
			if (!list.parentId && list.itemIds.length == 0) {
				await db.delete(list._id);
				n++;
			}
		}));
		console.log(`${n} list${n == 1 ? "" : "s"} deleted`);
	},
});

export const removeListsWithDefaultName = internalMutation({
	handler: async ({db}) => {
		const lists = await db.query("lists").collect();
		let n = 0;
		await Promise.all(lists.map(async list => {
			if (list.name == "New list" || list.name == "Nouvelle liste" || list.name == "Новый список") {
				await db.delete(list._id);
				n++;
			}
		}));
		console.log(`${n} list${n == 1 ? "" : "s"} deleted`);
	},
});

export const removeOrphanItems = internalMutation({
	handler: async ({db}) => {
		const items = await db.query("items").collect();
		let n = 0;
		await Promise.all(items.map(async item => {
			const list = await db.get(item.listId);
			if (!list) {
				await db.delete(item._id);
				n++;
			}
		}));
		console.log(`${n} item${n == 1 ? "" : "s"} deleted`);
	},
});

export const removeListItemsWithOrphanList = internalMutation({
	handler: async ({db}) => {
		const items = await db.query("items").collect();
		let n = 0;
		await Promise.all(items.map(async item => {
			if (!item.childListId) {
				return;
			}
			const list = await db.get(item.childListId);
			if (!list) {
				await db.delete(item._id);
				n++;
			}
		}));
		console.log(`${n} item${n == 1 ? "" : "s"} deleted`);
	},
});

export const removeDeletedItemsOlderThan = internalMutation({
	args: {days: v.number()},
	handler: async ({db}, {days}) => {
		const dateBefore = Date.now() - days * 24 * 3600 * 1000;
		const items = await db.query("items").filter(q =>
			q.and(
				q.neq(q.field("deletedAt"), undefined),
				q.lt(q.field("deletedAt"), dateBefore),
			),
		).collect();
		const itemNames: string[] = [];
		await Promise.all(items.map(async item => {
			// await db.delete(item._id);
			itemNames.push(item.value || "-");
		}));
		console.log(`would delete items: ${itemNames.join(",")}`);
	}
})
