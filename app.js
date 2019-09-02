//@ts-check

/**
 * 
 * @param {Egg.Application} app 
 */
function eggApp(app){
    //@ts-ignore
    app.cache = {};
    app.ready( async () =>{
        app.logger.info(` eggjs app ready`);
    });
}
module.exports = eggApp;

// module.exports = app => {
    
//     app.cache = new Cache();
// };