import List from "./List";

import './App.css'
import { createContext, useState } from "react";
import { type Id } from "../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import NoList from "./NoList";

export const PageContext = createContext<{
	listId: Id<"lists"> | null,
	setListId: (listId: Id<"lists"> | null) => void,
}>({
	listId: null,
	setListId: () => {},
});

const ListPage = ({listId}: {listId: Id<"lists">}) => {
	const list = useQuery(api.lists.get, {listId});

	if (!list) {
		return null;
	}

	return <List list={list}/>;
}

const getListId = () => {
	return localStorage.getItem("lastList") as Id<"lists"> | null;
}

const App = () => {
	const [listId, setListId] = useState<Id<"lists"> | null>(getListId())

	return (
		<PageContext.Provider value={{listId, setListId}}>
			{listId ? <ListPage listId={listId}/> : <NoList/>}
		</PageContext.Provider>
	)
};

export default App
