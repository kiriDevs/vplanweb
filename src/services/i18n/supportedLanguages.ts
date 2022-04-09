const supportedLanguages = new Map<string, string>();

supportedLanguages.set("en", "English");
supportedLanguages.set("de", "Deutsch");

console.log("hello " + supportedLanguages.keys);

export default supportedLanguages;
