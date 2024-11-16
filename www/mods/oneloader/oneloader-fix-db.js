{
    // Could be nicer
    let old_push = DataManager._databaseFiles.push;
    DataManager._databaseFiles.push = function(data) {
        console.log(`Loading ${data.name} from ${data.src}`);
        DataManager.loadDataFile(data.name, data.src);
        return old_push.call(this, data);
    }
}