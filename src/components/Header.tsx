import { useState } from "react";
import classNames from "classnames";
import { useMutation } from "convex/react";

import { api } from "_generated/api";
import type { Id } from "_generated/dataModel";

import "./Header.css";
import MenuButton from "./MenuButton";
import Menu from "./Menu";

type List = {
	_id: Id<"lists">,
	isLoading: boolean,
	name: string,
};

const Header = ({list}: {list: List}) => {
	const {_id: listId} = list;

	const [isEditing, setIsEditing] = useState(false);

	const renameList = useMutation(api.lists.rename)
		.withOptimisticUpdate((localStore, {listId, name}) => {
			const list = localStore.getQuery(api.lists.get, {listId});
			if (list) {
				localStore.setQuery(api.lists.get, {listId}, {
					...list,
					name,
					isLoading: true,
				});
			}
		});

	const doRename = (name: string) => {
		setIsEditing(false);
		if (name) {
			renameList({listId, name});
		}
	};

	const handleBlur = (event: React.FocusEvent) => {
		doRename((event.target as HTMLInputElement).value.trim());
	};

	const handleKeyUp = (event: React.KeyboardEvent) => {
		if (event.key == "Enter") {
			doRename((event.target as HTMLInputElement).value.trim());
		}
	};

	return (
		<div className="header">
			<span className={classNames({name: true, isLoading: list.isLoading})}>
				{isEditing ? <input autoFocus enterKeyHint="done" defaultValue={list.name} onKeyUp={handleKeyUp} onBlur={handleBlur}/> : <span onClick={() => setIsEditing(true)}>{list.name}</span>}
			</span>
			<MenuButton>
				{closeMenu => <Menu listId={listId} closeMenu={closeMenu}/>}
			</MenuButton>
		</div>
	);
};

export default Header;
