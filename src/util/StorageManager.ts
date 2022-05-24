import migrators from "./StorageMigrators";

interface IStorageManager {
  startup: () => void;
  initialize: () => void;
  migrate: (from: string) => boolean;
}

export const CURRENT_LOCALSTORAGE_SCHEMA_VERSION = "1.4";

export const shared: IStorageManager = {
  startup: () => {
    const storageVersion = window.localStorage.getItem("storage.ls.version");
    if (!storageVersion) {
      shared.initialize();
    } else if (storageVersion === CURRENT_LOCALSTORAGE_SCHEMA_VERSION) {
      return;
    } else {
      const didMigrate = shared.migrate(/*from*/ storageVersion);
      if (didMigrate) {
        alert("Your localStorage was successfully migrated to a new schema version!");
      } else {
        alert(
          "Your localStorage is outdated and its version is no longer " +
            "supported for migration. Your localStorage will be " +
            "re-initialized. You will have to re-configure the app. " +
            "Sorry for the inconvenience :c"
        );
        shared.initialize();
      }
    }
  },
  initialize: () => {
    window.localStorage.clear();
    window.localStorage.setItem("auth.token", "");
    window.localStorage.setItem("filter.class", "");
    window.localStorage.setItem("filter.subjects", JSON.stringify([]));
    window.localStorage.setItem("filter", JSON.stringify(false));
    window.localStorage.setItem("filter.ignoreSubjects", JSON.stringify(false));
    window.localStorage.setItem("lang", "en");
    window.localStorage.setItem("storage.ls.version", CURRENT_LOCALSTORAGE_SCHEMA_VERSION);
  },
  migrate: (from: string) => {
    if (!migrators.has(from)) {
      return false;
    }

    migrators.get(from)!();
    window.localStorage.setItem("storage.ls.version", CURRENT_LOCALSTORAGE_SCHEMA_VERSION);
    return true;
  }
};
