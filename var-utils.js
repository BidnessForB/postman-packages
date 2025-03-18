function initialize(pattern ='rt_', scope = 'all') {
    if(getVar('rt_initialized', 'variables')) {
        console.log('Already initialized')
        return;
    }
    console.log("Initializing")
    unsetVars(pattern, scope);
    setVar('rt_initialized', true, 'variables');
}
function getVar(varName, scope = 'collection', asJson = true) {
    
    const retVal = getVars(scope, '^'+varName+'$');
    //console.log("RETVAL: ", retVal);
    
    if(retVal && retVal.length > 0) {
        //console.log("RETVAL getVar: ", retVal[0]);
        return asJson ? toJson(retVal[0].value) : retVal[0];
    }
    else {
        //console.log("Empty string");
        return null;
    }
}

function toJson(val) {
    
    try {
        return JSON.parse(val);
    }
    catch(e) {
        return val;
    }
    
}



function unsetVars(pattern = '^rt_', scope = 'collection') {
    varScopes = validateScope(scope).scopes;
    //console.log("Var scopes: ", varScopes)
    varScopes.forEach((curScope) => {
        getVars(curScope === 'collectionVariables' ? 'collection' : curScope, pattern).forEach((curVar) => {
            //console.log("pm[" + curScope + "]: ", pm[curScope])
            if(pm[curScope].values) {
                pm[curScope].unset(curVar.key);
            }
        });
    })
}

function setVar(varName, varVal, scope = 'collection', isJson = true) {
    if(scope === 'all') {
        throw new Error('Invalid scope: ' + scope + '.  Must specify a scope to set variables');
    }
    varScope = validateScope(scope).scopes[0];
    if(isJson && (typeof varVal === 'Object' || Array.isArray(varVal))) {
        varVal = JSON.stringify(varVal);
    }
    
    pm[varScope].set(varName, varVal);
}

function setVars(varVals = [], scope = 'collection') {
   varVals.each(vbl => setVar(vbl.key, vbl.value, scope));
}

function getVars(scope = 'collection', pattern = '.*') {
    
    varScopes = validateScope(scope).scopes;
    
    let retVal = [];
    
    const regexp = new RegExp(pattern);
    //console.log('varScopes: ', varScopes, ' pattern: ', regexp);
    
    varScopes.forEach((curScope) => {
        retVal = retVal.concat(pm[curScope].values.filter((vbl)  => regexp.test(vbl.key)));
        
    });
    //return pm[varScope].values.filter(vbl => regexp.test(vbl.key))
    //console.log("RETVAL: ", retVal);
    return retVal;
}

//Pop the value from an array stored in a variable and then set the value of that variable to the now truncated array

function popAndSet(arrVarName, newVarName, scope = 'collection' ) {
    let arrVarVal = getVar(arrVarName, scope);    
        if(!arrVarVal) {
                throw new Error('Variable ' + arrVarName + ' not found.');
            }
        else if (!Array.isArray(arrVarVal)) {
                throw new Error('Variable ' + arrVarName + ' is not an array');
            }
        else if (arrVarVal.length === 0) {
            return null;
        }
    //console.log("arrVarVal: ", arrVarVal)    
    let retVal = arrVarVal.pop();
    setVar(newVarName, retVal, scope);
    setVar(arrVarName, arrVarVal, scope);
    
    return retVal;
}

function pushAndSet(arrVarName, varValue, scope = 'collection') {
    let arrVarVal = getVar(arrVarName, scope);    
    //console.log("pushAndSet 1: ", arrVarVal);
    if (arrVarVal && !Array.isArray(arrVarVal)) {
            throw new Error('Variable ' + arrVarName + ' is not an array');
        }
    
    if(arrVarVal === null) {
        //console.log("arrVarVal: ", arrVarVal);
        arrVarVal = []
    }
    arrVarVal.push(varValue);
    setVar(arrVarName, arrVarVal, scope);   
    return arrVarVal;
}

function branchOnArray(varName, notEmptyPath, emptyPath, scope = 'collection')
{
    let arr = getVar(varName, scope);
    //console.log("ARR: ", arr);

    if(arr == null || typeof arr === 'undefined') {
        throw new Error('No variable ' + varName + ' in scope ' + scope);
    }

    if(!Array.isArray(arr)) {
        throw new Error ("Variable " + varName + ' in scope ' + scope + ' is not an array')
    }

    if(arr.length === 0) {
        console.log("Empty path");
        pm.execution.setNextRequest(emptyPath);
    }
    else {
        console.log("Not empty path");
        pm.execution.setNextRequest(notEmptyPath);
    }
}

function validateScope(scope) {
    //console.log("Scope: ", scope);
    const allScopes = ['collection','variables','all','environment'];
    if (allScopes.indexOf(scope) < 0) {
        throw new Error('Invalid scope (' + scope + "). Must be 'collection' or 'environment'");
    }
    let retScopes = (scope === 'all' ? ['collectionVariables','environment','variables'] : scope === 'collection' ? ['collectionVariables'] : [scope]);
    
    return {
        'scopeOrig':scope,
        'scopes':retScopes
    };
}


function readVarsToPostmanVariables(pattern = '.*',scope = 'collection') {
    const vars = getVars(scope, pattern);
    pm.variables.values.assimilate(vars);
    return pm.variables.values;
}
function writePostmanVars(pattern = '.*',scope = 'collection') {
    setVars(pm.variables.values.filter(vbl => new RegExp(pattern).test(vbl)), scope);
}

module.exports = {
    getVar
    ,setVar
    ,getVars
    ,setVars
    ,unsetVars
    ,popAndSet
    ,pushAndSet
    ,writePostmanVars
    ,readVarsToPostmanVariables
    ,branchOnArray
    ,initialize
}
