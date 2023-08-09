import { useMutation } from "convex/react";
import { useContext, useState } from "react";
import { api } from "../convex/_generated/api";
import { useTranslate } from "./translation";
import { PageContext } from "./App";

const NoList = () => {
	const [value, setValue] = useState("");

	const {t} = useTranslate();
	const createIfNonExisting = useMutation(api.lists.createIfNonExisting);
	const {setListId} = useContext(PageContext);

	const goToListOrCreate = async () => {
		const listId = await createIfNonExisting({listIdStr: value, color: "blue", name: t("newList")});
		setListId(listId);
		localStorage.setItem("lastList", listId);
	}

	return (
		<div>
			Enter a list id: <input type="text" value={value} onChange={event => setValue(event.target.value)}/>
			<button onClick={goToListOrCreate}>Let’s go</button>
		</div>
	)
}

export default NoList;
