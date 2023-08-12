import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";

import { type Id } from "_generated/dataModel";
import { api } from "_generated/api";

import List from "../components/List";

const ListPage = () => {
	const params = useParams();
	const listId = params.listId as Id<"lists">;
	const list = useQuery(api.lists.get, {listId});

	if (!list) {
		return null;
	}

	return <List list={list}/>;
}

export default ListPage;
