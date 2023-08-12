import classNames from "classnames";
import { Item } from "./Row";
import RestoreButton from "./RestoreButton";
import { api } from "_generated/api";
import { useMutation } from "convex/react";

const RecentlyDeletedRow = ({item}: {item: Item}) => {
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
