import { useTranslation } from "react-i18next";
import { Select } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import "./LanguageSwitcher.css";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value);
  };

  return (
    <div className="language-switcher">
      <Select
        value={i18n.language}
        onChange={handleLanguageChange}
        style={{ width: 120 }}
        options={[
          { label: "English", value: "en" },
          { label: "Tiếng Việt", value: "vi" },
        ]}
        suffixIcon={<GlobalOutlined />}
      />
    </div>
  );
}
