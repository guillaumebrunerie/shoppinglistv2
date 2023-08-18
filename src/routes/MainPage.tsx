import { useEffect, useReducer } from "react";
import { redirect } from "react-router-dom";

import type { Id } from "_generated/dataModel";

import { getKnownListIds, getLastListId } from "../localLists";

import ListOfLists from "../components/ListOfLists";

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

const useKnownLists = () => {
	const listIds = getKnownListIds();

	useRerenderOnStorageEvent();

	return {
		items: listIds.map(listId => ({
			childListId: listId as Id<"lists">,
			isCompleted: false as const,
		}))
	}
}

const MainPage = () => {
	const list = useKnownLists();

	return (
		<div>
			<ListOfLists list={list}/>
		</div>
	)
};

export default MainPage;
