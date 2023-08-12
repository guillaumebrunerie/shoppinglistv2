import classNames from "classnames";

import "./RestoreButton.css";

const RestoreButton = ({onClick, isCompleted}: {onClick: (event: React.MouseEvent) => void, isCompleted: boolean}) => {
	return (
		<svg className={classNames({restoreButton: true, isCompleted})} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
			viewBox="0 0 100 100" onClick={onClick}>
			<path
				fill="none" strokeLinecap="round" strokeLinejoin="round"
				d="M 15 80 h 50 a 25 25 0 0 0 0 -50 h -60 l 15 15 l -15 -15 l 15 -15"
			/>
		</svg>
	)
}

export default RestoreButton;
