class routing{
    v1(app){
        console.log('123');
        
        const parent_routes=require('./v1/user/route/routes');
     const webhook = require('./v1/user/route/webhooks')
        app.use('/v1/user',    parent_routes)
     app.use('/',webhook)
    }
    
}
module.exports=new routing();