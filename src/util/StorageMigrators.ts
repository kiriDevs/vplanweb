const migrators = new Map<string, Function>();

migrators.set("1.0", () => {
  window.localStorage.setItem("filter.class", "");
  window.localStorage.setItem("filter.subjects", JSON.stringify([]));
  migrators.get("1.1")!();
});

migrators.set("1.1", () => {
  window.localStorage.setItem("filter", JSON.stringify(false));
  migrators.get("1.2")!();
});

migrators.set("1.2", () => {
  window.localStorage.setItem("lang", "en");
});

migrators.set("1.3", () => {
  window.localStorage.setItem("filter.ignoreSubjects", JSON.stringify(false));
});

export default migrators;
