module.exports = (option,app)=>{
    return async function csrf(ctx,next){
        ctx.state.csrf = ctx.csrf
    }
}