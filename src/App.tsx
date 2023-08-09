import List from "./List";

import './App.css'
import { createContext, useState } from "react";
import { type Id } from "../convex/_generated/dataModel";

export const PageContext = createContext<{
	listId: Id<"lists">,
	setListId: (listId: Id<"lists">) => void,
}>({
	listId: "35wa7gb11k6q67a9dwsnppsg9hw58t8" as Id<"lists">,
	setListId: () => {},
});

const App = () => {
	const [listId, setListId] = useState<Id<"lists">>("35wa7gb11k6q67a9dwsnppsg9hw58t8" as Id<"lists">)

	return (
		<PageContext.Provider value={{listId, setListId}}>
			<List listId={listId}/>
		</PageContext.Provider>
	)
};

export default App
