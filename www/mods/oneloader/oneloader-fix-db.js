{
    /*
    // I may have overcomplicated this but just in case some plugin overrides it rudely
    let wrap_push = function(arr) {
        let old = arr.push;
        arr.push = function(data) {
            console.log(`Loading ${data.name} from ${data.src}`);
            DataManager.loadDataFile(data.name, data.src);
            return old.call(arr, data);
        };
    }

    let _db = DataManager._databaseFiles;
    Object.defineProperty(DataManager, "_databaseFiles", {
        get: () => _db,
        set: function(value) {
            if(Object.prototype.toString.call(value) === "[object Array]") {
                wrap_push(value);
            }
            _db = value;
        }
    });
    wrap_push(_db);*/
}