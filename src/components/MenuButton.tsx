import { useState, type ReactNode } from "react";

type MenuButtonProps = {
	children: (closeMenu: () => void) => ReactNode,
}

const MenuButton = ({children}: MenuButtonProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const openMenu = () => setIsOpen(true);
	const closeMenu = () => setIsOpen(false);

	return (
		<div className="menuButton">
			<span onClick={openMenu}>{"\u2807"}</span>
			{isOpen && (
				<div className="menu">
					{children(closeMenu)}
				</div>
			)}
			{isOpen && <div className="backdrop" onClick={closeMenu}/>}
		</div>
	);
};

export default MenuButton;
