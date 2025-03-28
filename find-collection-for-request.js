
function findCollectionIdForRequest(requestId, colNameFilter) {
    
    return new Promise((resolve, reject) => {
        var collectionIds = [];
        var colId = null;
        const url = pm.collectionVariables.get('cfg_baseUrl') + '/collections' + (colNameFilter ? '/?name=' + colNameFilter : '');

        const request = {
        url: url,
        method: 'GET',
        header: {
            'Content-Type': 'application/json',
            'x-api-key': pm.collectionVariables.get('cfg_pmanAPIKey')
        }
        };
        pm.sendRequest(request, (error, response) => {
        
        
        response.json().collections.map(col => {
            collectionIds.push(col.uid);
        });
        
        
        
        for (const colId of collectionIds) {
             searchCollection(colId,requestId).then(id => {
                if(id) {
                    pm.collectionVariables.set('myCollectionId', id);
                    resolve(id);
                }
            });
        }
    });
    });
}

function searchCollection(colId, itemId) {
    url = pm.collectionVariables.get('cfg_baseUrl') + '/collections/' + colId;
        const request = {
        url: url,
        method: 'GET',
        header: {
            'Content-Type': 'application/json',
            'x-api-key': pm.collectionVariables.get('cfg_pmanAPIKey')
            }
        };

        return new Promise((resolve, reject) => {
            pm.sendRequest(request, (error, response) => {
                if(error) {
                    console.log("ERROR: ", error);
                    return reject(error);
                }

                const reqIds = deepFindItems(response.json().collection.item,'request','id');

                if(reqIds.includes(itemId)) {
                    resolve(colId);
                }
                else {
                    resolve(null);
                }
            })
        });
}
function deepFindItems(items, type,  key) {
    let retVal = [];
    for(let i = 0; i < items.length; i++) {
        const item = items[i];
        if(!item.hasOwnProperty('item')) {
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


module.exports = findCollectionIdForRequest;
