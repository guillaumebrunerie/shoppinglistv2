import { useQuery } from "convex/react";
import { type Id } from "../convex/_generated/dataModel";
import { api } from "../convex/_generated/api";
import List from "./List";
import { useParams } from "react-router-dom";

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
