import { useState } from "react";

type InputProps = {
	placeholder: string,
	onSubmit: (value: string) => void;
}

const Input = ({placeholder, onSubmit}: InputProps) => {
	const [text, setText] = useState("");
	const handleChange = (event: React.ChangeEvent) => {
		setText((event.target as HTMLInputElement).value);
	};
	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			const value = event.currentTarget.value.trim();
			if (value) {
				onSubmit(value);
				setText("");
			}
		}
	};

	return (
		<li>
			<input
				className="edit"
				type="text"
				enterKeyHint="done"
				placeholder={placeholder}
				value={text}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
			/>
		</li>
	);
};

export default Input;
