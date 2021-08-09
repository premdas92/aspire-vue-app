<template>
  <section class="staff-login-block">
    <div class="align-max-width staff-login-wrapper">
      <div class="left-block">
        <h2>LOGIN</h2>
      </div>
      <div class="right-block">
        <div class="login-form-wrapper">
          <form>
            <div class="input-box">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                v-model="username"
              />
            </div>
            <div class="input-box">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                v-model="password"
              />
            </div>
            <div class="submit-btn">
              <button class="btn btn-primary" @click="login">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: "Login",
  data: function () {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login: function (e) {
      e.preventDefault();
      if(this.username === "admin" && this.password === "admin"){
          this.$router.push('/admin-dashboard');
          localStorage.setItem("isAdminLogged", true);
      }
      else if(this.username === "customer" && this.password === "customer"){
           this.$router.push('/customer-dashboard');
           localStorage.setItem("isCustomerLogged", true);
      }
      else{
          alert("Username or Password incorrect");
          this.$router.push('/admin-dashboard');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.staff-login-block {
  padding: 60px 0;
  .staff-login-wrapper {
    width: 35%;
    .left-block {
      background: linear-gradient(
          rgba(97, 114, 122, 0.5),
          rgba(97, 114, 122, 0.5)
        ),
        url("../assets/login-cover.jpg");
      background-size: cover;
      background-repeat: no-repeat;
      padding: 100px 0;
      background-position: center;
      border-radius: 10px;
      h2 {
        text-align: center;
        color: #fff;
        font-weight: 800;
        font-size: 40px;
      }
    }
    .right-block {
      .login-form-wrapper {
        padding: 60px 25px;
        box-shadow: 0 0 30px 0 rgba(68, 49, 49, 0.1);
        form {
          .input-box {
            input {
              text-transform: none;
            }
          }
          .submit-btn {
            text-align: center;
            padding-top: 30px;
          }
        }
      }
    }
  }
}
</style>