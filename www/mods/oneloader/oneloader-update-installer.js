let GH_AUTH="token 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";
const fs = require('fs');
const StreamZip = require('./modloader/node_stream_zip.js');

if ($modLoader.config && $modLoader.config._autoUpdater && $modLoader.config._autoUpdater.check === "allow" && $modLoader.config._autoUpdater.performUpdate && $modLoader.config._autoUpdater.updateBundleURL) {
    try {
        let headers = {};
        if (GH_AUTH.length > 0) {
            headers["Authorization"] = GH_AUTH;
        }
        window._logLine("Downloading update");
        let bundle = await fetch(params.config._autoUpdater.updateBundleURL, {headers}).then(res => res.arrayBuffer());
        fs.writeFileSync("_oneloader_update.zip", Buffer.from(bundle));
        let zip = new StreamZip.async({ file: "_oneloader_update.zip" });
        let entries = await zip.entries();
        let u = "u/";
        try { fs.mkdirSync("u"); } catch(e) {}
        for (let el in entries) {
            try { if (entries[el].isDirectory) { fs.mkdirSync(u + el); } } catch(e) {}
            if (entries[el].isDirectory) continue;
            fs.writeFileSync(u + el, await zip.entryData(el));
        }
        $modLoader.config._autoUpdater.performUpdate = false;
        $modLoader.config._autoUpdater.updateBundleURL = undefined;
        $modLoader.config._autoUpdater.lastCheck = Date.now();
        $modLoader.syncConfig();

        fs.unlinkSync("_oneloader_update.zip");
        await zip.close();

        setTimeout(function() {
            $modLoader.syncConfig();
        }, 500);
        setTimeout(function() {
            window.location.reload();
        }, 1000);
    } catch(E) {
        console.log(E);
        window._logLine("Failed to fetch or install update");
    }
}