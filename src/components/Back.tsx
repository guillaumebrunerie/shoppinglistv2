import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";

import { api } from "_generated/api";
import { type Id } from "_generated/dataModel";

import { useTranslate } from "../translation";

const BackButton = () => (
	<svg className="backThing" viewBox="0 0 60 100">
		<path d="M 50 90 L 10 50 L 50 10"/>
	</svg>
);

const Back = ({listId}: {listId: Id<"lists">}) => {
	const {t} = useTranslate();
	const navigate = useNavigate();
	const goBack = () => {
		navigate(-1);
	}
	useQuery(api.lists.get, {listId});
	return <span className="backButton" onClick={goBack}><BackButton/>{t("back")}</span>
};

export default Back;
