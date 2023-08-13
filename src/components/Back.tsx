import { Link, useNavigate } from "react-router-dom";
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
	useQuery(api.lists.get, {listId});
	return <Link className="backButton" to={`/lists/${listId}`}><BackButton/>{t("back")}</Link>
};

export default Back;
