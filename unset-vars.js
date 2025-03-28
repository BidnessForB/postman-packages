/* Unset all variables starting with specified prefix.  
   For example, variables set at runtime might be preceded with `rt_`
   */

function unsetVars(prefix){
let rtvars = pm.collectionVariables.values.filter((item) => item.key.startsWith(prefix))
rtvars.forEach((rtv) => {

    pm.collectionVariables.unset(rtv.key);
})
}
module.exports=unsetVars;
