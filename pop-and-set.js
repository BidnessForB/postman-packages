function popAndSet(varName, newVarName ) {
    let arr = JSON.parse(pm.collectionVariables.get(varName));
    if(!arr || arr.length == 0) {
        pm.collectionVariables.unset(newVarName);
        return null;
    }
    let retVal = arr.pop();
    pm.collectionVariables.set(varName, JSON.stringify(arr));
    if(typeof newVarName != 'undefined' &&  newVarName != null) {
        pm.collectionVariables.set(newVarName, retVal);
    }
    return retVal;
}
module.exports = popAndSet;
