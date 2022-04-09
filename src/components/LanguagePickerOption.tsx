import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { useTranslation } from "react-i18next";

import supportedLanguages from "../services/i18n/supportedLanguages";

interface ILanguagePickerOptionProps {
  lang: string;
}

const LanguagePickerOption = (props: ILanguagePickerOptionProps) => {
  const { i18n } = useTranslation();
  return (
    <DropdownItem
      onClick={() => {
        i18n.changeLanguage(props.lang);
      }}
    >
      {supportedLanguages.get(props.lang)}
    </DropdownItem>
  );
};

export default LanguagePickerOption;
