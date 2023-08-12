import { useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";

import { api } from "_generated/api";
import { type Id } from "_generated/dataModel";

import { useTranslate } from "../translation";

const getListId = () => {
	return localStorage.getItem("lastList") as Id<"lists"> | null;
};

export const loader = () => {
	const lastListId = getListId();
	if (lastListId) {
		return redirect(`/lists/${lastListId}`);
	}
	return null;
}

const MainPage = () => {
	const [value, setValue] = useState("");
	const navigate = useNavigate();

	const {t} = useTranslate();
	const createIfNonExisting = useMutation(api.lists.createIfNonExisting);

	const goToListOrCreate = async () => {
		const listId = await createIfNonExisting({listIdStr: value, color: "blue", name: t("newList")});
		navigate(`/lists/${listId}`);
		localStorage.setItem("lastList", listId);
	}

	return (
		<div>
			Enter a list id: <input type="text" value={value} onChange={event => setValue(event.target.value)}/>
			<button onClick={goToListOrCreate}>Let’s go</button>
		</div>
	)
};

export default MainPage;
