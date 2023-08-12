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
	} = item;

	const restore = useMutation(api.items.restore);

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
