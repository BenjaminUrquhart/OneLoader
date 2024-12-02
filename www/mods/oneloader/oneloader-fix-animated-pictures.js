// https://gist.github.com/BenjaminUrquhart/bf22468ce489bcf313055a749648fc30

let existing = $plugins.filter(p => p.name == "BU_FixOliviaAnimatedPictures");
if (existing.length < 1 || !existing[0].status) {
    console.log("BU_FixOliviaAnimatedPictures not found or not enabled, patching...")

    // Add functions that causes the crash here.
    let functions = ["resetFrame", "updateAnimatedPictureFrame"]

    for(let name of functions) {
        console.log("Patching " + name);
        (function(name) {
            let orig = Sprite_Picture.prototype[name];
            Sprite_Picture.prototype[name] = function(bitmap) {
                // The plugin relies on Sprite_Picture.loadBitmap returning fast enough to
                // set the bitmap field on the sprite object. This is usually the case, 
                // but not guaranteed. If the function takes a bit longer to return
                // than normal, the field is not set and we crash.
                
                // However, Bitmap.prototype._callLoadListeners provides the bitmap
                // as an argument, so we can just use that here instead.
                
                // tl;dr race condition.
                if(!this.bitmap) {
                    if(bitmap) {
                        console.warn("Load listener " + name + " was called before return of Sprite_Picture.loadBitmap");
                        this.bitmap = bitmap;
                    }
                    else {
                        // Bail
                        console.warn("Attempted call to " + name + " with no bitmap");
                        return;
                    }
                }
                return orig.call(this, ...arguments);
            }
        })(name);
    }
}
else {
    console.log("BU_FixOliviaAnimatedPictures found");
}