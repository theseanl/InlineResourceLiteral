class Settings {
    constructor() {
        // A comment
        this._settings = RESOURCE_OBJECT;
    }
    get settings() {
        return this._settings;
    }
    set settings(i) {
        this._settings = i;
    }
}
