import { useQuery } from "convex/react";
import { useTranslate } from "./translation";
import { useContext } from "react";
import { PageContext } from "./App";
import { api } from "../convex/_generated/api";
import { type Id } from "../convex/_generated/dataModel";

const BackButton = () => (
	<svg className="backThing" viewBox="0 0 60 100">
		<path d="M 50 90 L 10 50 L 50 10"/>
	</svg>
);

const Back = ({listId}: {listId: Id<"lists">}) => {
	const {t} = useTranslate();
	const {setListId} = useContext(PageContext);
	const goBack = () => {
		setListId(listId);
	}
	useQuery(api.lists.get, {listId});
	return <span className="backButton" onClick={goBack}><BackButton/>{t("back")}</span>
};

export default Back;
