import { useEffect, useReducer, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";

import { api } from "_generated/api";
import { type Id } from "_generated/dataModel";

import ListOfLists from "../components/ListOfLists";
import { List } from "../components/List";
import { addToKnownListIds, getKnownListIds, getLastListId, setLastListId } from "../localLists";

export const loader = () => {
	const lastListId = getLastListId();
	if (lastListId) {
		return redirect(`/lists/${lastListId}`);
	}
	return null;
}

const useRerenderOnStorageEvent = () => {
	const [, forceUpdate] = useReducer(n => n + 1, 0);
	useEffect(() => {
		window.addEventListener('storage', forceUpdate);
		return () => window.removeEventListener('storage', forceUpdate);
	}, []);
}

const useKnownLists = (): List => {
	const listIds = getKnownListIds();
	const names = useQuery(api.lists.getNames, {listIds: [...listIds].sort()});

	useRerenderOnStorageEvent();

	return {
		_id: "knownLists" as Id<"lists">,
		isLoading: false,
		name: "No name",
		items: listIds.map(listId => ({
			_id: "" as Id<"items">,
			listId: "" as Id<"lists">,
			childListId: listId as Id<"lists">,
			isCompleted: false,
			value: names?.[listId] || "(unknown list)",
			isLoading: false,
		}))
	}
}

const MainPage = () => {
	const [value, setValue] = useState("");
	const navigate = useNavigate();

	const createIfNonExisting = useMutation(api.lists.createIfNonExisting);

	const goToListOrCreate = async () => {
		const listId = await createIfNonExisting({listIdOrName: value, color: "blue"});
		navigate(`/lists/${listId}`);
		setLastListId(listId);
		addToKnownListIds(listId);
	}

	const list = useKnownLists();

	return (
		<div>
			Create/join a list: <input type="text" value={value} onChange={event => setValue(event.target.value)}/>
			<button onClick={goToListOrCreate}>Let’s go</button>
			<ListOfLists list={list}/>
		</div>
	)
};

export default MainPage;
