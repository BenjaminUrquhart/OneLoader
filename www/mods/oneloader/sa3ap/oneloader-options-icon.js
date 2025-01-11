{
    // Insert mod toggle menu icon into the prologue's ingame menu
    const plugin = $plugins.filter(p => p.name === "SRD_AltMenuScreen_BustIcons")[0];
    const params = plugin?.parameters;
    if(params) {
        // Attempt to find free symbol slot
        let found = false;
        let key;
        for(let i = 1; i <= 20; i++) {
            key = "Command Symbol " + i;
            if(!params[key] || String(params[key]).trim().length === 0) {
                params[key] = "mods";
                params["Command Icon " + i] = 118;
                found = true;
                break;
            }
        }

        if(!found) {
            // All parameter slots taken somehow, we need to manually insert the icon
            // However, the map is stored in a local variable, so we need to run
            // code within the closure to get to it.
            // The plugin eval's certain parameters within that scope, so we can abuse
            // this to get stuff set up.

            params["Gold Window Y"] = "if(!icons['mods']) { icons['mods'] = 118; this._commandWindow.drawAllItems(); } " + params["Gold Window Y"];
        }
    }
}