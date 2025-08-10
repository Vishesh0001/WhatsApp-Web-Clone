const db = require("../../../../config/database");
const common = require("../../../../utilities/common");
const responsecode = require("../../../../utilities/response-error-code")
const bcrypt = require("bcrypt");
// const sendEmail = require("../../../../utilities/sendEmail")
const User = require('./User')
 class UserModel{

async login(requestd){
    try {
        const request_data = JSON.parse(requestd)
        let email = request_data.email
        // console.log('erer',email);
        
        // console.log('e',request_data);
        
                const user = await User.find(
            { email:email}      
        );
        // console.log('sd',user)
        if(user){
 const isMatch = await bcrypt.compare(request_data.password, user[0].passwordHash);
                        if (isMatch) {
                            let role = user[0].role
                            let id = user[0]._id
                            let generatedToken = common.generateToken(id, role)
                            return({
                                code:1,
                                message:{keyword:'Login Success!'},
                                data:{token:generatedToken},
                                status:200
                            })
        }else{
                return({
                                code:0,
                                message:{keyword:'Invlaid Credentials'},
                                data:[],
                                status:400
                            })
        }
    }else{
            return({
                                code:0,
                                message:{keyword:'No user found'},
                                data:[],
                                status:400
                            })
    }
                         
                      
    } catch (error) {
        console.log(error.message);
        
         return({
                                code:4,
                                message:{keyword:'internal server Error'},
                                data:[],
                                status:500
                            })
    }
}

async getUsers(id){
    try {
        // First find the requesting user's role
// console.log(id);

        let user;
        if (id === 'customer') {
            // If customer → fetch all agents
            user = await User.find({ role: 'agent' });
        } else if (id === 'agent') {
            // If agent → fetch all customers
            user = await User.find({ role: 'customer' });
        } else {
            // If role is neither customer nor agent, return empty
            return ({
                code:0,
                message:{keyword:'Invalid role'},
                data:[],
                status:403
            });
        }

        if(!user || user.length === 0){
            return ({
                code:0,
                message:{keyword:'No users found'},
                data:[],
                status:400
            });
        } else {
            return({
                code:1,
                message:{keyword:'users found'},
                data:user,
                status:200
            });
        }
      
    } catch (error) {
        console.log('model error',error.message);
        return ({
            code:0,
            message:{keyword:'internal server Error'},
            data:[],
            status:500
        });
    }
}

async getprofilepic(id){
    // console.log('id',id);
    
        try {
        const user = await User.find({_id:id},{profilePic:1});
        if(!user){
return ({
    code:0,
    message:{keyword:'No users found'},
    data:[],
    status:400
})
        }else{
            return({
   code:1,
    message:{keyword:'pic found'},
    data:user,
    status:200
            })
        }
      
    } catch (error) {
        console.log('model error',error.message);
     return ({
    code:0,
    message:{keyword:'internal server Error'},
    data:[],
    status:500
})
    }
}

}module.exports = new UserModel();