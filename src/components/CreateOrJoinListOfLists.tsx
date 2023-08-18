import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";

import { api } from "_generated/api";

import { useTranslate } from "../translation";
import { addToKnownListIds, setLastListId } from "../localLists";

import Input from "./Input";

const CreateOrJoinListOfLists = () => {
	const {t} = useTranslate();
	const navigate = useNavigate();

	const createIfNonExisting = useMutation(api.lists.createIfNonExisting);

	const goToListOrCreate = async (listIdOrName: string) => {
		const listId = await createIfNonExisting({listIdOrName, color: "blue"});
		navigate(`/lists/${listId}`);
		setLastListId(listId);
		addToKnownListIds(listId);
	}

	return (
		<Input
			placeholder={t("createOrJoin")}
			onSubmit={goToListOrCreate}
		/>
	)
};

export default CreateOrJoinListOfLists;
