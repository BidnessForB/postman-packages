/* 
  Use this code in a collection pre-request script to run an initialization
  routine once per collection run
  */

const init = pm.variables.get('initialized');
if(typeof init != undefined && init ) {
    console.log("Already initialized");
    return;
}
pm.variables.set('initialized', true);
//initialization code
console.log("Initializing");
