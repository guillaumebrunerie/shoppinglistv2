import { useMutation } from "convex/react";
import classNames from "classnames";

import { api } from "_generated/api";
import type { ConnectedItem } from "../../convex/lists";

import RestoreButton from "./RestoreButton";

const RecentlyDeletedRow = ({item}: {item: ConnectedItem}) => {
	const {
		_id: itemId,
		value,
		isCompleted,
		isLoading,
		listId,
	} = item;

	const restore = useMutation(api.items.restore)
		.withOptimisticUpdate(localStore => {
			const list = localStore.getQuery(api.lists.getRecentlyDeleted, {listId});
			if (list) {
				localStore.setQuery(api.lists.getRecentlyDeleted, {listId}, {
					...list,
					items: list.items.filter(item => item?._id !== itemId),
				});
			}
		});

	const doRestore = () => {
		restore({itemId});
	};

	return (
		<li
			className={classNames({
				isCompleted,
				isLoading,
			})}
		>
			<span className={classNames({itemText: true, isLoading, isCompleted})}>
				{value}
			</span>
			<RestoreButton onClick={doRestore} isCompleted={isCompleted}/>
		</li>
	)
};

export default RecentlyDeletedRow;
