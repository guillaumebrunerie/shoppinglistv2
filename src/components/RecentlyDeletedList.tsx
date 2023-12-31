import { Fragment } from "react";
import classNames from "classnames";

import type { ConnectedList } from "../../convex/lists";

import { useTranslate } from "../translation";

import Back from "./Back";
import RecentlyDeletedRow from "./RecentlyDeletedRow";

import "./RecentlyDeletedList.css";

const RecentlyDeletedList = ({list}: {list: ConnectedList}) => {
	const {_id: listId, items, isLoading} = list;
	const {t} = useTranslate();

	const getDateHeader = (from: {deletedAt?: number} | undefined, to: {deletedAt?: number}) => {
		if (!to.deletedAt) throw new Error("error");
		if (from && !from.deletedAt) throw new Error("error");
		const options = {day: "numeric", month: "long", hour: "numeric", minute: "numeric"} as const;
		const strTo = new Intl.DateTimeFormat(t("locale"), options).format(new Date(to.deletedAt));
		const strFrom = from && from.deletedAt ? new Intl.DateTimeFormat(t("locale"), options).format(new Date(from.deletedAt)) : "";
		return strTo === strFrom ? null : `(${t("date").replace("%s", strTo)})`;
	};

	return (
		<main className="recentlyDeleted">
			<Back listId={listId}/>
			<div className="header">
				<span className={classNames({name: true, isLoading})}>
					{t("recentlyDeleted")}
				</span>
			</div>
			<ul>
				{items.map((item, i) => (
					<Fragment key={item._id}>
						<div className="dateHeader">
							{getDateHeader(items[i - 1], items[i])}
						</div>
						<RecentlyDeletedRow item={item}/>
					</Fragment>
				))}
			</ul>
		</main>
	);
};

export default RecentlyDeletedList;
