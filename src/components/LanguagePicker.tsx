import classNames from "classnames";
import { useSetLanguage, type Lang, supportedLanguages, useTranslate, flag } from "../translation";

type LanguagePickerProps = {
	closeMenu: () => void,
};

const LanguagePicker = ({closeMenu}: LanguagePickerProps) => {
	const {lang} = useTranslate();
	const setLanguage = useSetLanguage();
	const handleSetLanguage = (lang: Lang) => () => {
		setLanguage(lang);
		closeMenu();
	};

	return (
		<div className="flagMenuItem">
			{supportedLanguages.map(thisLang => (
				<div
					className={classNames({flag: true, isSelected: thisLang == lang})}
					key={thisLang}
					onClick={handleSetLanguage(thisLang)}
				>
					{flag(thisLang)}
				</div>
			))}
		</div>
	)
};

export default LanguagePicker;
