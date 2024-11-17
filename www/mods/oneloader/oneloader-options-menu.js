// TODO: make options menu work in SA3AP
if (Yanfly.Param.OptionsCategories !== undefined) {

    // Hook config management so changes are saved in the right place.
    let Window_Options_getConfigValue = Window_Options.prototype.getConfigValue;
    Window_Options.prototype.getConfigValue = function(symbol) {
        if (symbol.startsWith("MOD_")) {
            return $modLoader.config[symbol.substring(4)];
        }
        return Window_Options_getConfigValue.call(this, symbol);
    };

    let Window_Options_setConfigValue = Window_Options.prototype.setConfigValue;
    Window_Options.prototype.setConfigValue = function(symbol, value) {
        if (symbol.startsWith("MOD_")) {
            $modLoader.config[symbol.substring(4)] = value;
            $modLoader.syncConfig();
            return;
        }
        Window_Options_setConfigValue.call(this, symbol, value);
    };

    // Update option spacing
    let Window_OptionsCategory_updateHelp = Window_OptionsCategory.prototype.updateHelp;
    Window_OptionsCategory.prototype.updateHelp = function() {
        if(this._helpWindow && this.currentExt()) {
            let data = this.currentExt();
            if (data.hasOwnProperty("OptionSpacing")) {
                this._optionsWindow.itemHeight = function() {
                    return data.OptionSpacing;
                }
            }
            else {
                this._optionsWindow.itemHeight = Window_Selectable.prototype.itemHeight;
            }
        }
        Window_OptionsCategory_updateHelp.call(this);
    }

    let Window_Options_drawOptionsOnOff = Window_Options.prototype.drawOptionsOnOff;
    Window_Options.prototype.drawOptionsOnOff = function(index, onText, offText, centered) {
        if (centered) {
            onText = onText || 'ON';
            offText = offText || 'OFF';
            let rect = this.itemRectForText(index);
            this.resetTextColor();
            let symbol = this.commandSymbol(index);
            let value = this.getConfigValue(symbol);

            let onWidth = this.textWidth(onText);
            let offWidth = this.textWidth(offText);

            this.changePaintOpacity(!value);
            this.drawText(offText, rect.x + rect.width / 3 - offWidth / 2, rect.y + rect.height / 2);
            this.changePaintOpacity(value);
            this.drawText(onText, rect.x + (rect.width / 3) * 2 - onWidth / 2, rect.y + rect.height / 2);
        }
        else {
            Window_Options_drawOptionsOnOff.call(this, index, onText, offText);
        }
    };

    // Hide mod toggles from the default "All" options category.
    // I'm sure there's a much better way to do this.
    let Window_Command_addCommand = Window_Command.prototype.addCommand;
    Window_Command.prototype.addCommand = function(name, symbol, enabled, ext) {
        if (ext && ext.OptionsList && Yanfly && Yanfly.Param && symbol === "category" && name === Yanfly.Param.OptionsAllCmd) {
            for(let i = 0; i < ext.OptionsList.length; i++) {
                let entry = ext.OptionsList[i];
                if(entry.HideFromAll) {
                    ext.OptionsList.splice(i, 1);
                    i--;
                }
            }
        }
        Window_Command_addCommand.call(this, name, symbol, enabled, ext);
    }

    // Helper function
    Window_Options.prototype.commandExt = function(index) {
        if(index >= 0) {
            return this._list[index]?.ext
        }
    }

    console.log("Injecting options")

    // Insert mod toggles into the options menu.
    // We don't have the luxury of default options so we have
    // to fill out all the fields manually.
    let modOptions = []
    let canToggle = true;
    for(let mod of $modLoader.allMods.values()) {
        canToggle = !mod._flags || !mod._flags.includes("prevent_disable");
        console.log(`Adding ${canToggle ? "toggle" : "label"} for ${mod.name} (${mod.id})`);
        modOptions.push({
            "---Functions---": "",
            "---Settings---": "",
            CursorLeftCode: JSON.stringify(canToggle ? "var index = this.index();\nvar symbol = this.commandSymbol(index);\nthis.changeValue(symbol, false);" : "this.currentExt().PlayCancel();"),
            CursorRightCode: JSON.stringify(canToggle ? "var index = this.index();\nvar symbol = this.commandSymbol(index);\nthis.changeValue(symbol, true);" : "this.currentExt().PlayCancel();"),
            DefaultConfigCode: '""',

            DrawItemCode: JSON.stringify("let ext = this.commandExt(index); ext.DrawItem.call(this, index, ext.CanToggle);"),

            Enable: JSON.stringify("enable = " + canToggle),
            Ext: '"ext = data;"', // Funny
            HelpDesc: JSON.stringify("<wordwrap>" + (mod.description || "No description set")),
            LoadConfigCode: '""',
            MakeCommandCode: JSON.stringify("this.addCommand(name, symbol, enabled, ext);"),
            Name: mod.name,
            ProcessOkCode: JSON.stringify(canToggle ? "var index = this.index();\nvar symbol = this.commandSymbol(index);\nthis.changeValue(symbol, !this.getConfigValue(symbol));" : "this.currentExt().PlayCancel();"),
            SaveConfigCode: '"$modLoader.syncConfig();"',
            ShowHide: '"show = true;"',
            Symbol: "MOD_" + mod.id,
            HideFromAll: true,

            CanToggle: canToggle,

            PlayCancel: () => AudioManager.playSe({ name: "Cancel1", volume: 90, pitch: 100, pan: 0 }),
            DrawItem: function(index, canToggle) {
                this.resetTextColor();
                if(canToggle) {
                    this.changePaintOpacity(this.isCommandEnabled(index));
                    this.drawOptionsName(index);
                    this.drawOptionsOnOff(index, "ON", "OFF", true);
                }
                else {
                    this.drawOptionsName(index); 
                    this.changePaintOpacity(false); 

                    let text = "Cannot be disabled";
                    let width = this.textWidth(text); 
                    let rect = this.itemRectForText(index); 
                    this.drawText(text, rect.x + (rect.width - width) / 2, rect.y + rect.height / 2);
                }
            }
        });
    }
    Yanfly.Param.OptionsCategories.push({
        "---Settings---": "",
        Name: "\\i[135]Mods",
        HelpDesc: JSON.stringify("<wordwrap>Manage loaded mods. Changes will take place on reload or restart."),
        OptionsList: modOptions,
        OptionSpacing: Window_Base.prototype.lineHeight.call(this) * 2
    });
}