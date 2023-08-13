import type { Id } from "_generated/dataModel";

// Last list

export const getLastListId = () => {
	return localStorage.getItem("lastList") as Id<"lists"> | null;
};

export const setLastListId = (listId: Id<"lists">) => {
	localStorage.setItem("lastList", listId);
};

export const unsetLastListId = () => {
	localStorage.removeItem("lastList");
};

// Known lists

export const getKnownListIds = (): Id<"lists">[] => {
	const listIdsStr = localStorage.getItem("knownLists");
	if (!listIdsStr) {
		return [];
	}
	try {
		return JSON.parse(listIdsStr);
	} catch (e) {
		return [];
	}
};

export const setKnownListIds = (listIds: Id<"lists">[]) => {
	localStorage.setItem("knownLists", JSON.stringify(listIds));
	window.dispatchEvent(new Event("storage"))
};

export const addToKnownListIds = (listId: Id<"lists">) => {
	const listIds = getKnownListIds();
	setKnownListIds([...listIds, listId]);
};

export const removeKnownListId = (listId: Id<"lists">) => {
	const listIds = getKnownListIds();
	setKnownListIds(listIds.filter(id => id !== listId));
};

export const reorderKnownListIds = (listId: Id<"lists">, index: number) => {
	const listIds = getKnownListIds();
	const indexFrom = listIds.findIndex(id => id == listId);
	if (indexFrom == -1) {
		return;
	}
	listIds.splice(indexFrom, 1);
	listIds.splice(index, 0, listId);
	setKnownListIds(listIds);
};
