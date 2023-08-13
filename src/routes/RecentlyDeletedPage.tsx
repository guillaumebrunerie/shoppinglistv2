import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";

import type { Id } from "_generated/dataModel";
import { api } from "_generated/api";

import RecentlyDeletedList from "../components/RecentlyDeletedList";

const RecentlyDeletedPage = () => {
	const params = useParams();
	const listId = params.listId as Id<"lists">;
	const list = useQuery(api.lists.getRecentlyDeleted, {listId});

	if (!list) {
		return null;
	}

	return <RecentlyDeletedList list={list}/>;
}

export default RecentlyDeletedPage;
