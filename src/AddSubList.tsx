import "./AddSubList.css";
import { type Id } from "../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

import "./AddSubList.css";

const AddSubList = ({listId}: {listId: Id<"lists">}) => {
	const add = useMutation(api.lists.add)

	return (
		<svg className="addSubList" viewBox="-10 -10 120 120" onClick={() => add({color: "blue", listId, name: "New list"})}>
			<circle cx="50" cy="50" r="50"/>
			<path d="M 50 25 L 50 75 M 25 50 L 75 50"/>
		</svg>
	)
};

export default AddSubList;
