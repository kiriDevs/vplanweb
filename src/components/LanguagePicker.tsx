import DropdownButton from "react-bootstrap/DropdownButton";
import { useTranslation } from "react-i18next";
import supportedLanguages from "../services/i18n/supportedLanguages";
import LanguagePickerOption from "./LanguagePickerOption";

interface ILanguagePickerProps {
  className: string;
}

const LanguagePicker = (props: ILanguagePickerProps) => {
  const { i18n } = useTranslation();
  return (
    <DropdownButton title={supportedLanguages.get(i18n.language) + " "} variant="secondary" className={props.className}>
      {Array.from(supportedLanguages.keys()).map((langKey) => (
        <LanguagePickerOption lang={langKey} />
      ))}
    </DropdownButton>
  );
};

export default LanguagePicker;
