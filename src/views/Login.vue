<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <!-- <p style="margin-left:45px">登录</p> -->
        <img src="../assets/logo.png" alt="" />

        <!-- <img src="../../assets/logo.png" alt="" /> -->
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <el-form-item> 欢迎登录 </el-form-item>
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="cap" style="vertical-align: middle;">
          <!-- v-model="loginForm.password" -->
          <el-input
            v-model="loginForm.cap"
            style="width: 75%;"
            type="text"
            placeholder="请输入验证码:"
          ></el-input>
          <a href="#" rel="external nofollow" @click="editCaptcha">
            <img
              src="http://localhost:3001/api/getCaptcha"
              alt=""
              ref="imgYzm"
              style="width: 25%"
            />
          </a>
          <!-- <img src="http://localhost:3001/api/getCaptcha" alt="captcha" style="width:25%"> -->
        </el-form-item>

        <!-- 阅读协议 -->
        <!-- <el-form-item prop="agree">
          <el-checkbox v-model="loginForm.agree"
            >我已阅读并同意用户协议和隐私条款</el-checkbox
          >
        </el-form-item> -->

        <!-- <div class="forget" @click="forgot">
          <a>忘记密码？</a>
        </div> -->
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="createUser">注册</el-button>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import request from "@/utils/request";
// import { login } from '@/api/login'
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456",
        cap: "",
        // agree: false,
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        // 验证随机图片
        cap: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          {
            min: 4,
            max: 5,
            message: "长度在 4 到 5 个字符",
            trigger: "blur",
          },
        ],
        // agree: [
        //   {
        //     // 自定义校验规则：https://element.eleme.cn/#/zh-CN/component/form#zi-ding-yi-xiao-yan-gui-ze
        //     // 验证通过：callback()
        //     // 验证失败：callback(new Error('错误消息'))
        //     // validator 验证函数不是你来调用的，而是当 element 表单触发验证的时候它会自己内部调用
        //     // 所以你只需要提供校验函数处理逻辑就可以了
        //     //   通过：callback()
        //     validator: (rule, value, callback) => {
        //       if (value) {
        //         // 验证通过
        //         callback();
        //       } else {
        //         // 验证失败
        //         callback(new Error("请同意用户协议"));
        //       }
        //     },
        //     // message: '请勾选同意用户协议',
        //     trigger: "blur",
        //   },
        // ],
      },
    };
  },
  created() {},
  mounted() {
    //绑定事件
    window.addEventListener("keydown", this.keyDown);
    this.editCaptcha()
  },
  destroyed() {
    //销毁事件
    window.removeEventListener("keydown", this.keyDown, false);
  },
  methods: {
    editCaptcha() {
      this.$refs.imgYzm.src =
        "http://localhost:3001/api/getCaptcha?d=" + Math.random();
    },
    createUser() {
      // console.log(1);
      this.$router.push("/register");
    },
    keyDown(e) {
      //如果是回车则执行登录方法
      if (e.keyCode == 13) {
        this.login();
      }
    },

    forgot() {
      //  this.$message('本系统服务于商城后台管理，相关账号密码请联系内部人员获取');
      this.$alert(
        "本系统服务于番茄果果商城后台管理，仅供内部工作人员使用，相关账号密码请联系内部人员获取",
        "温馨提示",
        {
          confirmButtonText: "确定",
        }
      );
    },
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      // 表单验证
      // this.$refs.loginFormRef.validate(async (valid) => {
      //   if (!valid) return;
      //   // 验证通过，提交登录
      //   login(this.loginForm)
      //     .then((res) => {
      //       console.log(res);
      //       // 登录成功
      //       if (res.data.meta.status !== 200) return this.$message.error('登录失败！')
      //      this.$message.success('登录成功')
      //     // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
      //     //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
      //     //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
      //     // 将接口返回的用户相关数据放到本地存储，方便应用数据共享
      //     // 本地存储只能存储字符串
      //     // 如果需要存储对象、数组类型的数据，则把他们转为 JSON 格式字符
      //     window.sessionStorage.setItem('token', res.data.data.token)
      //      window.sessionStorage.setItem('username', res.data.data.username)
      //     this.$router.push('/home')
      //     })

      // });
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;

        let captcha = document.cookie.split("=")[1];
        let yzm = this.loginForm.cap;
        console.log(yzm);
        console.log(captcha);
        if (yzm != captcha) {
          return this.$message.warning("验证码错误");
        }

        const { data: res } = await this.$http.post("/login", this.loginForm);
        console.log(res);
        if (res.message !== "ok") return this.$message.error(res.message);
        this.$message.success("登录成功");
        // console.log(res.data.username);
        // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
        //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        // 将接口返回的用户相关数据放到本地存储，方便应用数据共享
        // 本地存储只能存储字符串
        // 如果需要存储对象、数组类型的数据，则把他们转为 JSON 格式字符串进行存储
        window.sessionStorage.setItem("token", res.token);
        window.sessionStorage.setItem("username", res.user.username);
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  // background-color: #2b4b6b;
  background-color: rgb(55, 61, 65);
  // background-image: url(../assets/vue.jpg);

  height: 100%;
}

.login_box {
  width: 560px;
  height: 400px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  top: 80px;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  margin-top: -10px;
}

.forget {
  position: absolute;
  top: 160px;
  left: 410px;
  display: flex;
  justify-content: flex-start;
  color: rgb(160, 160, 160);
  a:hover {
    text-decoration: underline;
  }
}
</style>
