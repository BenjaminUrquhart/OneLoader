if (window.nw.App.argv[0] !== "test") {
    console.log("Loading basic oneloader configuration.");
    const MAX_MANIFEST_VERSION = 1;
    const ID_BLACKLIST = ["gomori"];
    const EXTENSION_RULES = {
        "png": { "encrypt": "rpgmaker", "target_extension": "rpgmvp" },
        "ogg": { "encrypt": "rpgmaker", "target_extension": "rpgmvo" }
    };

    let LANGUAGE = "en";
    try {
        const fs = require("fs");
        const js = fs.readFileSync("www/js/plugins.js", "utf8")
        eval(js.replace("var $plugins", "window.___tmp_plugins"))
        LANGUAGE = window.___tmp_plugins.filter(
            a => a.name.toLowerCase() === "text_language_processor"
        )[0].parameters["Default Language"];
    } catch (error) {
        console.log("Failed to read default language.");
        console.log(error);
    } finally {
        window.___tmp_plugins = undefined;
    }

    const DATA_RULES = [
        {
            jsonKeys: [
                "data", "data_delta", "data_pluto", "data_pluto_delta"
            ],
            formatMap: {
                "json": { target: "json", delta: false, encrypt: true },
                "jsond": { target: "json", delta: true, delta_method: "json", encrypt: true },
                "yml": { target: "yaml", delta: false, encrypt: true },
                "ymld": { target: "yaml", delta: true, delta_method: "yaml", encrypt: true },
                "yaml": { target: "yaml", delta: false, encrypt: true },
                "yamld": { target: "yaml", delta: true, delta_method: "yaml", encrypt: true },
            },
            mountPoint: "data"
        },
        {
            jsonKeys: [
                "text", "text_delta"
            ],
            formatMap: {
                "yml": { target: "yaml", delta: false, encrypt: true },
                "ymld": { target: "yaml", delta: true, delta_method: "yaml", encrypt: true },
                "yaml": { target: "yaml", delta: false, encrypt: true },
                "yamld": { target: "yaml", delta: true, delta_method: "yaml", encrypt: true },
            },
            mountPoint: "languages/" + LANGUAGE
        },
        {
            jsonKeys: [
                "maps", "maps_delta"
            ],
            formatMap: {
                "json": { target: "js", delta: false, encrypt: true },
                "jsond": { target: "js", delta: true, delta_method: "json", encrypt: true },
            },
            mountPoint: "maps"
        },
        {
            jsonKeys: [
                "plugins", "plugins_delta"
            ],
            formatMap: {
                "js": { target: "js", delta: false, encrypt: true },
                "jsd": { target: "js", delta: true, delta_method: "append", encrypt: true },
                "mjs": { target: "js", delta: false, encrypt: true, parser: "esm" }, 
            },
            mountPoint: "js/plugins",
            pluginList: true
        }
    ];

    window.$ONELOADER_CONFIG = {
        MAX_MANIFEST_VERSION, ID_BLACKLIST, EXTENSION_RULES, DATA_RULES
    };
} else {
    console.log("Loading playtest configuration");
    const MAX_MANIFEST_VERSION = 1;
    const ID_BLACKLIST = ["gomori"];
    const EXTENSION_RULES = {
        "png": { "encrypt": "rpgmaker", "target_extension": "png" },
        "ogg": { "encrypt": "rpgmaker", "target_extension": "ogg" }
    };

    const DATA_RULES = [
        {
            jsonKeys: [
                "data", "data_delta", "data_pluto", "data_pluto_delta"
            ],
            formatMap: {
                "json": { target: "json", delta: false, encrypt: true },
                "jsond": { target: "json", delta: true, delta_method: "json", encrypt: true },
                "yml": { target: "yaml", delta: false, encrypt: true },
                "ymld": { target: "yaml", delta: true, delta_method: "yaml", encrypt: true },
                "yaml": { target: "yaml", delta: false, encrypt: true },
                "yamld": { target: "yaml", delta: true, delta_method: "yaml", encrypt: true },
            },
            mountPoint: "data"
        },
        {
            jsonKeys: [
                "text", "text_delta"
            ],
            formatMap: {
                "yml": { target: "yaml", delta: false, encrypt: true },
                "ymld": { target: "yaml", delta: true, delta_method: "yaml", encrypt: true },
                "yaml": { target: "yaml", delta: false, encrypt: true },
                "yamld": { target: "yaml", delta: true, delta_method: "yaml", encrypt: true },
            },
            mountPoint: "languages/en"
        },
        {
            jsonKeys: [
                "maps", "maps_delta"
            ],
            formatMap: {
                "json": { target: "json", delta: false, encrypt: true },
                "jsond": { target: "json", delta: true, delta_method: "json", encrypt: true },
            },
            mountPoint: "maps"
        },
        {
            jsonKeys: [
                "plugins", "plugins_delta"
            ],
            formatMap: {
                "js": { target: "js", delta: false, encrypt: true },
                "jsd": { target: "js", delta: true, delta_method: "append", encrypt: true },
                "mjs": { target: "js", delta: false, encrypt: true, parser: "esm" },
            },
            mountPoint: "js/plugins",
            pluginList: true
        }
    ];

    window.$ONELOADER_CONFIG = {
        MAX_MANIFEST_VERSION, ID_BLACKLIST, EXTENSION_RULES, DATA_RULES
    };
}