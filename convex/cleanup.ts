import { mutation } from "./_generated/server";

export const removeOrphanLists = mutation({
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
		return `${n} list${n == 1 ? "" : "s"} deleted`;
	},
});

export const removeEmptyRootLists = mutation({
	handler: async ({db}) => {
		const lists = await db.query("lists").collect();
		let n = 0;
		await Promise.all(lists.map(async list => {
			if (!list.parentId && list.itemIds.length == 0) {
				await db.delete(list._id);
				n++;
			}
		}));
		return `${n} list${n == 1 ? "" : "s"} deleted`;
	},
});

export const removeListsWithDefaultName = mutation({
	handler: async ({db}) => {
		const lists = await db.query("lists").collect();
		let n = 0;
		await Promise.all(lists.map(async list => {
			if (list.name == "New list" || list.name == "Nouvelle liste" || list.name == "Новый список") {
				await db.delete(list._id);
				n++;
			}
		}));
		return `${n} list${n == 1 ? "" : "s"} deleted`;
	},
});

export const removeOrphanItems = mutation({
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
		return `${n} item${n == 1 ? "" : "s"} deleted`;
	},
});

export const removeListItemsWithOrphanList = mutation({
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
		return `${n} item${n == 1 ? "" : "s"} deleted`;
	},
});

