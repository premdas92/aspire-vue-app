<template>
  <section
    class="align-max-width customer-dashboard-block"
    v-if="isCustomerLogged"
  >
    <button class="btn btn-danger logout-btn" @click="logoutCustomer">
      Logout Custmer
    </button>
    <h1>Customer Panel</h1>
    <div class="align-horizontally customer-dashboard-wrapper">
      <div class="left">
        <h4>Loan Application</h4>
        <div class="form-wrapper">
          <form>
            <div class="input-box">
              <label>Name</label>
              <b-form-input
                v-model="name"
                placeholder="Enter your name"
              ></b-form-input>
            </div>
            <div class="input-box">
              <label>Email</label>
              <b-form-input
                v-model="email"
                placeholder="Enter your email"
              ></b-form-input>
            </div>
            <div class="input-box">
              <label>Loan Amount Required (in INR)</label>
              <b-form-input
                v-model="amount"
                placeholder="Enter loan amount"
              ></b-form-input>
            </div>
            <div class="input-box">
              <label>Loan Tenure (In weeks)</label>
              <b-form-input
                v-model="tenure"
                placeholder="Enter loan tenure (in weeks)"
              ></b-form-input>
            </div>
            <div
              class="submit-btn"
              :class="name && email && amount && tenure ? 'enable' : ''"
            >
              <button class="btn btn-primary" @click="applyLoan">Apply</button>
            </div>
          </form>
        </div>
      </div>
      <div class="right">
        <h4>Loan Tracker</h4>
        <div class="tracker-wrapper">
          <div
            class="loan"
            v-for="items in allSubmittedRequests"
            :key="items.id"
          >
            <div class="detail">
              <label>Loan Id :</label>
              <span>{{ items.id }}</span>
            </div>
            <div class="detail">
              <label>Loan Amount :</label>
              <span>&#8377; {{ items.amount }}</span>
            </div>
            <div class="detail">
              <label>Loan Tenure :</label>
              <span>{{ items.loanTerm }} weeks</span>
            </div>
            <div class="detail" v-if="items.isApproved === 'Approved'">
              <label>Date of approval :</label>
              <span>{{ items.date | formatDate }}</span>
            </div>
            <div class="detail" v-if="items.isApproved === 'Approved'">
              <label>Weekly EMI :</label>
              <span>&#8377; {{ items.amount / items.loanTerm }} / week</span>
            </div>
            <div class="detail" v-if="items.isApproved === 'Approved'">
              <label>Amount paid :</label>
              <span>&#8377; {{ items.paidAmount }}</span>
            </div>
            <div class="detail" v-if="items.isApproved === 'Approved'">
              <label>Pending amount :</label>
              <span>&#8377; {{ items.pendingAmount }}</span>
            </div>
            <div class="detail">
              <label>Status :</label>
              <span :class="items.isApproved">{{ items.isApproved }}</span>
            </div>
            <div class="detail" v-if="items.isApproved === 'Approved'">
              <label>Next EMI date :</label>
              <span>{{ items.emiDate | formatDate }}</span>
            </div>
            <div
              class="pay-btn"
              v-if="
                items.isApproved === 'Approved' && items.pendingAmount !== 0
              "
            >
              <button class="btn btn-success" @click="payEMI(items)">
                Pay EMI
              </button>
            </div>
            <div
              class="complete"
              v-if="
                items.isApproved === 'Approved' && items.pendingAmount === 0
              "
            >
              <h4>Loan Complete</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section v-else class="unauthorised">
    <h1>You are unauthorised. Please log in</h1>
    <button class="btn btn-success" @click="login">Login</button>
  </section>
</template>
<script>
import axios from "axios";
export default {
  name: "CustomerDashboard",
  mounted() {
    if (localStorage.getItem("isCustomerLogged")) {
      this.isCustomerLogged = true;
      this.getAllSubmittedRequests();
    }
  },
  data: function () {
    return {
      name: "",
      email: "",
      amount: "",
      tenure: "",
      allSubmittedRequests: "",
      isCustomerLogged: false,
    };
  },
  methods: {
    applyLoan: function () {
      axios
        .post("http://localhost:5000/loanApplicants", {
          id: Math.random(),
          name: this.name,
          email: this.email,
          amount: this.amount,
          loanTerm: this.tenure,
          isApproved: "Pending",
        })
        .then((res) => {
          if (res.status === 201)
            alert("Application has been sent sucessfully !!");
          this.name = "";
          this.email = "";
          this.amount = "";
          this.tenure = "";
           window.location.reload();
        })
        .catch(() => {
          alert("Something went wrong !!");
        });
    },
    getAllSubmittedRequests: function () {
      axios.get("http://localhost:5000/loanApplicants").then((res) => {
        if (res.status === 200) {
          this.allSubmittedRequests = res.data;
        }
      });
    },
    logoutCustomer: function () {
      this.isCustomerLogged = false;
      localStorage.removeItem("isCustomerLogged");
      this.$router.push("/");
    },
    login: function () {
      this.$router.push("/");
    },
    payEMI: function (items) {
      axios
        .patch(`http://localhost:5000/loanApplicants/${items.id}`, {
          paidAmount: items.paidAmount + items.amount / items.loanTerm,
          pendingAmount: items.pendingAmount - items.paidAmount,
        })
        .then((res) => {
          if (res.status === 200) {
            alert("EMI paid successfully !!");
            window.location.reload();
          }
        })
        .catch(() => {
          alert("Something went wrong !!");
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.unauthorised {
  text-align: center;
  padding: 100px 0;
}
.customer-dashboard-block {
  padding: 50px 30px;
  .logout-btn {
    float: right;
  }
  h1 {
    text-align: center;
  }
  .customer-dashboard-wrapper {
    align-items: flex-start;
    margin-top: 20px;
    .left {
      width: 40%;
      h4 {
        text-align: center;
        margin-bottom: 20px;
      }
      .form-wrapper {
        box-shadow: 0 0 30px 0 rgba(68, 49, 49, 0.1);
        padding: 25px 40px;
        form {
          .submit-btn {
            text-align: center;
            padding-top: 30px;
            pointer-events: none;
            opacity: 0.6;
            &.enable {
              pointer-events: auto;
              opacity: 1;
            }
          }
        }
      }
    }
    .right {
      width: 40%;
      h4 {
        text-align: center;
      }
      .tracker-wrapper {
        box-shadow: 0 0 30px 0 rgba(68, 49, 49, 0.1);
        padding: 25px 40px;
        .loan {
          padding: 10px 0;
          border-bottom: 1px solid;
          &:last-child {
            border-bottom: none;
          }
          .detail {
            label {
              font-weight: bold;
              padding-right: 5px;
            }
            .Pending {
              background: yellow;
              padding: 5px 15px;
            }
            .Approved {
              background: green;
              padding: 5px 15px;
            }
            .Rejected {
              background: red;
              color: #fff;
              padding: 5px 15px;
            }
          }
          .pay-btn {
            text-align: center;
          }
          .complete {
            h4 {
              color: #fff;
              background: #28a745;
              padding: 5px;
            }
          }
        }
      }
    }
  }
}
</style>