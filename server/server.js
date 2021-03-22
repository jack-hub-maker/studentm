const { User,Student } = require('./models')
const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()
const SECRET = 'dehabdhabjhrfajfr13uh24yh'

app.use(require('cors')())
app.use(express.json())

// 设置为可跨域
// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')
//     res.header("Content-Type", "*");
//     next();
// });
app.all('*',function(req, res, next) {//处理跨域
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1');
	//res.header("Content-Type","*");  /**/
	next();
})

app.get('/api/users', async (req, res) => {
    const users = await User.find()
    res.send(users)
})

app.post('/api/register', async (req, res) => {
    //    console.log(req.body);

    const users = await User.findOne({
        username: req.body.username,
        // password:req.body.password,
    })
    if (users) {        
    return res.send({
        message: '该用户已存在'
    })}
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
    })
    res.send({
        user,
        message:'ok'
    })
})

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username,
        // password:req.body.password,
    })
    if (!user) {
        // return res.status(422).send({
        return res.send({
            message: '用户名不存在'
        })
    }
    const isPasswordValid = require('bcryptjs').compareSync(
        req.body.password,
        user.password
    )
    if (!isPasswordValid) {
        // return res.status(422).send({
        return res.send({
            message: '密码无效'
        })
    }
    // return res.status(200).send({
    //     message: 'ok'
    // })
    //生成token

    const token = jwt.sign({
        id: String(user._id),
    }, SECRET)
    res.send({
        user,
        token: token,
        message:'ok'
    })
})

const auth = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop()
    // console.log(req.headers.authorization);
    // console.log(raw);
    //const raw = String(req.headers.authorization)
    const { id } = jwt.verify(raw, SECRET)
    req.user = await User.findById(id)
    next()
}

app.get('/api/profile', auth, async (req, res) => {
    res.send(req.user)
})

app.get('/api/orders', auth, async (req, res) => {
    const orders = await Order.find().where({
        user:req.user
    })
    res.send(orders)
})


app.get('/api/echarts',auth,async(req,res) =>{
    const grade = await Student.find({$where:function(){return this.clan<80}});
    const gradea = await Student.find({$where:function(){return this.javalan<80}});
    // const grade = await Student.find({clan:{ $lte: 60}});
    console.log(grade);
    console.log(gradea);

    let clan=[];
    for (let i = 0; i < grade.length; i++) {
        const nb = grade[i].clan;
        clan.push(nb)
        console.log(nb);
    }
    console.log(clan);

    let javalan=[];
    for (let i = 0; i < gradea.length; i++) {
        const nba = gradea[i].javalan;
        javalan.push(nba)
        console.log(nba);
    }
    console.log(javalan);

    const xAxis= javalan;
    const series = clan;
    const echarts =[xAxis,series]
    res.send(echarts);
})
//显示学生列表：
app.get('/api/getStudentList',auth,async(req,res)=>{
    const students = await Student.find()
    res.send(students)
})
//录入学生：
app.post('/api/students',auth,async(req,res)=>{
    const student = await Student.create(req.body)
    //返回给前端： 
    res.send(student)
})
//删除学生：
app.delete('/api/students/:id',auth,async(req,res)=>{
    await Student.findByIdAndDelete(req.params.id)
    //返回：
    res.send({
        status:true
    })
})
//回显学生详细信息用于修改：
app.get('/api/update/:id',auth,async(req,res)=>{
    const student = await Student.findById(req.params.id)
    res.send(student)
})
//更新学生信息：
app.put('/api/confirmUpdate/:id',auth,async(req,res)=>{
    const student = await Student.findByIdAndUpdate(req.params.id,req.body)
    res.send(student)
})
//根据学号精确查询：
app.get('/api/findBySnumber/:xuehao',auth,async(req,res)=>{
    
    const students = await Student.find({'snumber':req.params.xuehao})
    res.send(students)
})
// //根据姓名模糊查询：
// app.get('/api/findByName/:names',async(req,res)=>{
//     var query = new RegExp(req.params.names)
//     const students = await Student.find({$or:[{"name": query}]})
//     res.send(students)
// })

//根据姓名模糊分页查询:
app.get('/api/findByName',auth, (req,res)=>{

    result= {
        data:{},
        total:''
    };
    // var total;
    var confident = new RegExp(req.query.names)
    console.log(req.query.names);
    console.log(confident);
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
app.all('/api/studentList',auth,(req,res,next)=>{

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
    // console.log("页码shishi：");
    console.log(pageSize+"   "+currentPage);
     Student.find({},(error,data)=>{
         result.data = data;
         res.send(result);
    }).skip((currentPage-1)*pageSize).limit(pageSize);//对结果默认排序

});


app.listen(3001, () => {
    console.log('http://localhost:3001');
})