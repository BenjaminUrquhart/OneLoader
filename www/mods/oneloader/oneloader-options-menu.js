if (Yanfly.Param.OptionsCategories === undefined) {
    // START AGAIN START AGAIN START AGAIN: a prologue


    // I can't make heads or tails of what plugin SA3AP uses for options
    // so I'm rolling my own.


    // Window_TitleCommand

    let Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        Window_TitleCommand_makeCommandList.call(this);
        this.addCommand("Mods", 'mods');

        // Add mods option to main menu, just above the quit button
        let cmds = this._list;
        let modCmd = cmds.pop();
        for(let i = 0; i < cmds.length; i++) {
            let cmd = cmds[i];
            if(cmd.symbol === 'exitGame') {
                cmds.splice(i, 0, modCmd);
                break;
            }
        }
    }


    // Scene_Title

    let Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        Scene_Title_createCommandWindow.call(this);
        this._commandWindow.setHandler('mods', this.processMods.bind(this));
        this._commandWindow.y += 40; // move window down a little to not cover the game title
    }

    Scene_Title.prototype.processMods = function() {
        SceneManager.push(Scene_Mods);
    }


    // Scene_Menu

    let Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('mods', this.processMods.bind(this));
    }

    Scene_Menu.prototype.processMods = function() {
        SceneManager.push(Scene_Mods);
    }


    // Window_MenuCommand

    let Window_MenuCommand_makeCommandList = Window_MenuCommand.prototype.makeCommandList;
    Window_MenuCommand.prototype.makeCommandList = function() {
        Window_MenuCommand_makeCommandList.call(this);
        this.addCommand("Mods", 'mods');

        let cmds = this._list;
        let modCmd = cmds.pop();
        for(let i = 0; i < cmds.length; i++) {
            let cmd = cmds[i];
            if(cmd.symbol === 'save') {
                cmds.splice(i, 0, modCmd);
                break;
            }
        }
    }


    // Scene_Mods

    function Scene_Mods() {
        this.initialize.apply(this, arguments);
    }

    Scene_Mods.prototype = Object.create(Scene_Options.prototype);
    Scene_Mods.prototype.constructor = Scene_Mods;

    Scene_Mods.prototype.create = function() {
        Scene_Options.prototype.create.apply(this, arguments);
        this.updatePlacements();
    }

    Scene_Mods.prototype.terminate = function() {
        Scene_Options.prototype.terminate.call(this);
        $modLoader.syncConfig();
    }

    Scene_Mods.prototype.updatePlacements = function() {
        // TODO: better layout

        //this._optionsWindow.x = 0;
        //this._optionsWindow.width = this.width;
        this._optionsWindow.y = this._helpWindow.y + this._helpWindow.height;
        this._optionsWindow.height = this.height - this._helpWindow.height + this._helpWindow.y;
    }

    Scene_Mods.prototype.createOptionsWindow = function() {
        this.createHelpWindow();
        this._helpWindow.setText("test");
        this._optionsWindow = new Window_Mods();
        this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
        this._optionsWindow.setHelpWindow(this._helpWindow);
        this.addWindow(this._optionsWindow);
    }


    // Window_Mods

    function Window_Mods() {
        this.initialize.apply(this, arguments);
    }

    Window_Mods.prototype = Object.create(Window_Options.prototype);
    Window_Mods.prototype.constructor = Window_Mods;

    Window_Mods.prototype.updatePlacements = () => {};

    Window_Mods.prototype.initialize = function() {
        Window_Options.prototype.initialize.call(this);
    }

    Window_Mods.prototype.isVolumeSymbol = () => false;

    Window_Mods.prototype.makeCommandList = function() {
        let canToggle;
        for(let mod of $modLoader.allMods.values()) {
            canToggle = !mod._flags || !mod._flags.includes("prevent_disable");
            this.addCommand(mod.name, mod.id, canToggle);
        }
    }

    Window_Mods.prototype.updateHelp = function() {
        // TODO: description line wrapping

        let id = this._list[this.index()].symbol;
        let mod = $modLoader.allMods.get(id);
        this._helpWindow.setText(mod ? mod.description : "Invalid mod: " + id);
    }

    Window_Mods.prototype.changeValue = function() {
        if(!this._list[this.index()].enabled) {
            SoundManager.playCancel();
            return;
        }

        // Bypass plugin
        if(DreamX?.Options?.Window_Options_changeValue) {
            DreamX.Options.Window_Options_changeValue.apply(this, arguments);
        }
        else {
            Window_Options.prototype.apply(this, arguments);
        }
    }

    Window_Mods.prototype.statusText = function(index) {
        return this._list[index].enabled ? this.booleanStatusText(this.getConfigValue(this.commandSymbol(index))) : "N/A";
    }

    Window_Mods.prototype.getConfigValue = function(symbol) {
        return $modLoader.config[symbol];
    }

    Window_Mods.prototype.setConfigValue = function(symbol, value) {
        $modLoader.config[symbol] = !!value;
    }

    // end
}
else {
    // In Stars And Time

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
                if (!this._optionsWindow._oldItemHeight) {
                    this._optionsWindow._oldItemHeight = this._optionsWindow.itemHeight;
                }
                this._optionsWindow.itemHeight = function() {
                    return data.OptionSpacing;
                }
            }
            else if (this._optionsWindow._oldItemHeight) {
                this._optionsWindow.itemHeight = this._optionsWindow._oldItemHeight;
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