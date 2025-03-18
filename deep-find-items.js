function deepFindItems(items, type,  key) {
    let retVal = [];
    for(let i = 0; i < items.length; i++) {
        const item = items[i];
        if(!item.hasOwnProperty('item')) {
            //console.log("REQUEST: ", !type || (type == 'request'))
            if(!type || (type == 'request')) {
                retVal.push(!key ? item : item[key]);
            }
        } 
        else {
            if(!type || (type == 'folder')) {
            retVal.push(!key ? item : item[key]);
            }
            retVal = retVal.concat(deepFindItems(item.item, type, key));
        }
    }
return retVal;
}
module.exports = deepFindItems;
