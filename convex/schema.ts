import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	lists: defineTable({
		name: v.string(),
		color: v.string(),
		itemIds: v.array(v.id("items")),
		parentId: v.optional(v.id("items")),
		originalId: v.optional(v.string()),
	}),
	items: defineTable({
		deletedAt: v.optional(v.number()),
		value: v.optional(v.string()),
		isCompleted: v.boolean(),
		childListId: v.optional(v.id("lists")),
		listId: v.id("lists"),
		originalId: v.optional(v.string()),
	}),
});
