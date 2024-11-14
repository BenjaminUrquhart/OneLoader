{
    let functions = ["resetFrame", "updateAnimatedPictureFrame"]

    for(let name of functions) {
        console.log("Patching " + name);
        (function(name) {
            let orig = Sprite_Picture.prototype[name];
            Sprite_Picture.prototype[name] = function() {
                if(!this.bitmap) {
                    console.warn("Attempted call to " + name + " with no bitmap");
                    return;
                }
                return orig.call(this, ...arguments);
            }
        })(name);
    }
}