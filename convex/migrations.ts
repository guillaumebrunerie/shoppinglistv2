// import { mutation } from "./_generated/server";

// export const fixCompleted = mutation({
// 	handler: async ({db}) => {
// 		const items = await db.query("items").collect();
// 		await Promise.all(items.map(async item => {
// 			await db.patch(item._id, {completed: undefined});
// 		}))
// 	},
// })
