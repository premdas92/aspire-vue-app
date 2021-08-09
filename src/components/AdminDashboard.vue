<template>
  <section class="align-max-width admin-dashboard-block" v-if="isAdminLogged">
    <button class="btn btn-danger logout-btn" @click="logoutAdmin">
      Logout
    </button>
    <h1>Admin Panel</h1>
    <div class="admin-dashboard-wrapper">
      <div class="applied-loans-wrapper">
        <div
          class="align-horizontally loan"
          v-for="items in allAppliedLoans"
          :key="items.id"
        >
          <div class="left">
            <div class="detail">
              <label>Name :</label>
              <span>{{ items.name }}</span>
            </div>
            <div class="detail">
              <label>Email :</label>
              <span>{{ items.email }}</span>
            </div>
            <div class="detail">
              <label>Amount :</label>
              <span>&#8377; {{ items.amount }}</span>
            </div>
            <div class="detail">
              <label>Loan Term :</label>
              <span>{{ items.loanTerm }} weeks</span>
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
          </div>
          <div class="right" v-if="items.pendingAmount !== 0">
            <button
              class="btn btn-success"
              @click="approveLoan(items)"
              v-if="items.isApproved !== 'Approved'"
            >
              Approve
            </button>
            <button
              class="btn btn-danger"
              @click="rejectLoan(items)"
              v-if="items.isApproved !== 'Rejected'"
            >
              Reject
            </button>
          </div>
          <div
            class="complete"
            v-if="items.isApproved === 'Approved' && items.pendingAmount === 0"
          >
            <h4>Loan Complete</h4>
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
  name: "AdminDashboard",
  mounted() {
    if (localStorage.getItem("isAdminLogged")) {
      this.isAdminLogged = true;
      this.getAllLoans();
    }
  },
  data: function () {
    return {
      allAppliedLoans: "",
      isAdminLogged: false,
    };
  },
  methods: {
    getAllLoans: function () {
      axios.get("http://localhost:5000/loanApplicants").then((res) => {
        if (res.status === 200) {
          this.allAppliedLoans = res.data;
        }
      });
    },
    logoutAdmin: function () {
      this.isAdminLogged = false;
      localStorage.removeItem("isAdminLogged");
      this.$router.push("/");
    },
    login: function () {
      this.$router.push("/");
    },
    rejectLoan: function (items) {
      axios
        .put(`http://localhost:5000/loanApplicants/${items.id}`, {
          name: items.name,
          email: items.email,
          amount: items.amount,
          loanTerm: items.loanTerm,
          isApproved: "Rejected",
          date: new Date(),
        })
        .then((res) => {
          if (res.status === 200) {
            alert("Rejected !!");
            window.location.reload();
          }
        })
        .catch(() => {
          alert("Something went wrong !!");
        });
    },
    approveLoan: function (items) {
      var date = new Date();
      date.setDate(date.getDate() + 7);
      axios
        .put(`http://localhost:5000/loanApplicants/${items.id}`, {
          name: items.name,
          email: items.email,
          amount: items.amount,
          loanTerm: items.loanTerm,
          isApproved: "Approved",
          date: new Date(),
          paidAmount: 0,
          pendingAmount: items.amount,
          emiDate: date,
        })
        .then((res) => {
          if (res.status === 200) {
            alert("Approved !!");
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
.admin-dashboard-block {
  padding: 50px 30px;
  .logout-btn {
    float: right;
  }
  h1 {
    text-align: center;
  }
  .admin-dashboard-wrapper {
    .applied-loans-wrapper {
      .loan {
        padding: 10px 0;
        border-bottom: 1px solid;
        &:last-child {
          border-bottom: none;
        }
        .left {
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
              color: #fff;
            }
            .Rejected {
              background: red;
              color: #fff;
              padding: 5px 15px;
            }
          }
        }
        .complete {
          h4 {
            color: #fff;
            background: #28a745;
            padding: 5px;
          }
        }
        .right {
          .btn-success {
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>