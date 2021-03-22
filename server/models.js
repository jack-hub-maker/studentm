const mongoose = require("mongoose")

// mongoose.connect('mongodb:localhost:27017/express-auth',{
//      useNewUrlParser: true 
// })
mongoose.connect('mongodb://localhost:27017/express-auth', {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     useCreateIndex: true,
     useFindAndModify:true,
})
const UserSchema = new mongoose.Schema({
     username: { type: String, unique: true },
     password: {
          type: String, 
          set(val) {
               return require('bcryptjs').hashSync(val, 10)
          }
     }
})
const StudentSchema = new mongoose.Schema({
     snumber:{type:String},
     class:{type:String},
     name:{type:String},
     sex:{type:String},
     clan:{type:String},
     javalan:{type:String},
     dblan:{type:String},
 })

const User = mongoose.model('User', UserSchema)
const Student = mongoose.model('Student', StudentSchema)
// User.db.dropCollection('users')
module.exports = { User,Student }