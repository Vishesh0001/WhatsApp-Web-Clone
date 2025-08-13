class routing{
    v1(app){
        const parent_routes=require('./v1/user/route/routes');
        app.use('/v1/user',    parent_routes)
    
    }
    
}
module.exports=new routing();