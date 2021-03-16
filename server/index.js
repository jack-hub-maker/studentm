const express = require('express')
const app = express()
const mongoose = require('mongoose')
app.use(require('cors')())
app.use(express.json())
//服务端端口首页：
app.get('/',async(req,res) =>{
    res.send('hello node')
})

//显示学生列表：
app.get('/api/getStudentList',async(req,res)=>{
    const students = await Student.find()
    res.send(students)
})
//录入学生：
app.post('/api/students',async(req,res)=>{
    const student = await Student.create(req.body)
    //返回给前端： 
    res.send(student)
})
//删除学生：
app.delete('/api/students/:id',async(req,res)=>{
    await Student.findByIdAndDelete(req.params.id)
    //返回：
    res.send({
        status:true
    })
})
//回显学生详细信息用于修改：
app.get('/api/update/:id',async(req,res)=>{
    const student = await Student.findById(req.params.id)
    res.send(student)
})
//更新学生信息：
app.put('/api/confirmUpdate/:id',async(req,res)=>{
    const student = await Student.findByIdAndUpdate(req.params.id,req.body)
    res.send(student)
})
//根据学号精确查询：
app.get('/api/findBySnumber/:xuehao',async(req,res)=>{
    
    const students = await Student.find({'snumber':req.params.xuehao})
    res.send(students)
})
//根据姓名模糊查询：
app.get('/api/findByName/:names',async(req,res)=>{
    var query = new RegExp(req.params.names)
    const students = await Student.find({$or:[{"name": query}]})
    res.send(students)

})
//姓名模糊分页查询:
app.get('/api/findByName', (req,res)=>{

    result= {
        data:{},
        total:''
    };
    // var total;
    var confident = new RegExp(req.query.names)

    //总记录数：
    var query =  Student.find({$or:[{"name": confident}]});
    query.count({},function(err, count){
        if(err){
            res.json(err)
        }else{
            result.total = count;
            console.log("count的值是：",result.total);
        }
    });
    //第几页的数据：
    pageSize = parseInt(req.query.pageSize);
    currentPage = parseInt(req.query.currentPage);

    Student.find({},(error,data)=>{
            result.data = data;
            res.send(result);
    }).where({$or:[{"name": confident}]}).skip((currentPage-1)*pageSize).limit(pageSize);//对结果默认排序

})
//分页查询列表：
app.all('/api/studentList',(req,res,next)=>{

    result= {
        data:[],
        total:''
    };
    // var total;
    //总记录数：
    var query =  Student.find({});
    query.count({},function(err, count){
        if(err){
            res.json(err)
        }else{
            result.total = count;
            console.log("count的值是：",result);
        }
    });
    //第几页的数据：
    pageSize = parseInt(req.query.pageSize);
    currentPage = parseInt(req.query.currentPage);
    console.log("页码shishi：");
    console.log(pageSize+"   "+currentPage);
     Student.find({},(error,data)=>{
         result.data = data;
         res.send(result);
    }).skip((currentPage-1)*pageSize).limit(pageSize);//对结果默认排序

});


//数据库：
mongoose.connect('mongodb://localhost:27017/studentm',{
    useUnifiedTopology: true,
    useNewUrlParser:true,
    useFindAndModify:true,
    useCreateIndex:true,
})
const Student = mongoose.model('Student',new mongoose.Schema({
    snumber:{type:String},
    class:{type:String},
    name:{type:String},
    sex:{type:String},
    clan:{type:String},
    javalan:{type:String},
    dblan:{type:String},
}))



app.listen(3001,()=>{
    console.log('http://127.0.0.1:3001/')
})