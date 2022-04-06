const migrators = new Map<string, Function>();

migrators.set("1.0", () => {
  window.localStorage.setItem("filter.class", "");
  window.localStorage.setItem("filter.subjects", JSON.stringify([]));
  migrators.get("1.1")!();
});

migrators.set("1.1", () => {
  window.localStorage.setItem("filter", JSON.stringify(false));
});

export default migrators;
