/*
    This file is part of the OneLoader project and is licensed under the same terms (MIT)
*/

{
    const sa3ap = !!Imported.DreamX_Options;
    const _injection_point_1 = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        _injection_point_1.call(this);
        this._one_loader = {
            "loader_version":new Sprite(new Bitmap(816, 32)),
            "mods_loaded":new Sprite(new Bitmap(816, 32)),
            "mods_total":new Sprite(new Bitmap(816, 32)),
            "test_mode":new Sprite(new Bitmap(816, 32))
        };
        let y = 32;
        for (let key in this._one_loader) {
            this.addChild(this._one_loader[key]);
            this._one_loader[key].position.set(0, y);
            this._one_loader[key].bitmap.fontSize = 24;
            y += 32;
        }

        const version = $modLoader.knownMods.get("oneloader").json.version;
        const loadedAmount = $modLoader.knownMods.size;
        const allAmount = $modLoader.allMods.size;

        const align = sa3ap ? "right" : "left";
        const pos = sa3ap ? 4 : 16;

        if ($modLoader.isInTestMode) {
            this._one_loader.test_mode.bitmap.drawText(`!!TEST MODE!!`, pos, 4, 800, 16, align);
        }
        this._one_loader.loader_version.bitmap.drawText(`OneLoader ${version}`, pos, 4, 800, 16, align);
        this._one_loader.mods_loaded.bitmap.drawText(`Mods in use: ${loadedAmount}`, pos, 4, 800, 16, align);
        this._one_loader.mods_total.bitmap.drawText(`Mods total: ${allAmount}`, pos, 4, 800, 16, align);
    }
}