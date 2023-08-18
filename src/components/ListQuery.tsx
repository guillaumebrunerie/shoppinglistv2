import { useQuery } from "convex/react";

import { api } from "_generated/api";
import type { Id } from "_generated/dataModel";

const ListQuery = ({listId}: {listId: Id<"lists">}) => {
	useQuery(api.lists.get, {listId});
	return null;
};

export default ListQuery;
