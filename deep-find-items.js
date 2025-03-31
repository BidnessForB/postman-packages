/* 
Recursively find items in a Postman collection.  The SDK does not support this.  
Currently supports finding folders and requests.  
TODO: Expand to support finding examples, variables, etc  
USAGE:  
deepFindItems(items,type,key)  
|-|-|
|items|Array of postman items, eg collection.item|
|type|`request` or `folder`|
|key|Key of the item to find|
*/

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
