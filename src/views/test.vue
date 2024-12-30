<template>
  <div class="wrapper">
          <div class="container">
            <input type="radio" name="slide" id="c1" checked />
            <label for="c1" class="card">
              <div class="row">
                <div class="icon">1</div>
                <div class="description">
                  <div
                    class="search_container"
                    style="position: absolute; left: 30%"
                  >
                    <input type="text" required />

                    <label>Wavy&nbsp;Input&nbsp;Text&nbsp;Animation</label>
                  </div>

                  <!-- <h4>Winter</h4>
                  <p>请您输入患者ID</p> -->
                </div>
              </div>
            </label>
            <input type="radio" name="slide" id="c2" />
            <label for="c2" class="card">
              <div class="row">
                <div class="icon">2</div>
                <div class="description">
                  <h4>Digital Technology</h4>
                  <p>Gets better every day - stay tuned</p>
                </div>
              </div>
            </label>
            <input type="radio" name="slide" id="c3" />
            <label for="c3" class="card">
              <div class="row">
                <div class="icon">3</div>
                <div class="description">
                  <h4>Globalization</h4>
                  <p>Help people all over the world</p>
                </div>
              </div>
            </label>
            <input type="radio" name="slide" id="c4" />
            <label for="c4" class="card">
              <div class="row">
                <div class="icon">4</div>
                <div class="description">
                  <h4>New technologies</h4>
                  <p>Space engineering becomes more and more advanced</p>
                </div>
              </div>
            </label>
          </div>
        </div>
</template>

<script>
export default {
  name: "ml-panel",
  data() {
    return {};
  },
  props: {
    info: Object,
  },
  created() {},
  mounted() {},
};
</script>
<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
}

body {
  background-color: #eeeeea;
}

.wrapper {
  width: 100%;
  height: calc(100vh - 60px - 65px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  height: 600px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: start;
}

.card {
  position: relative;
  width: 80px;
  border-radius: 0.75rem;
  background-size: cover;
  cursor: pointer;
  overflow: hidden;
  border-radius: 2rem;
  margin: 0 10px;
  display: flex;
  align-items: center;
  transition: 0.6s cubic-bezier(0.28, -0.03, 0, 0.99);
  box-shadow: 0px 10px 30px -5px rgba(0, 0, 0, 0.8);
}

.card > .row {
  color: white;
  display: flex;
  flex-wrap: nowrap;
}

.card > .row > .icon {
  background: #223;
  color: white;
  border-radius: 50%;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px;
}

.card > .row > .description {
  display: flex;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  height: 80px;
  width: 520px;
  opacity: 0;
  transform: translateY(30px);
  transition-delay: 0.3s;
  transition: all 0.3s ease;
}

.description p {
  color: #b0b0ba;
  padding-top: 5px;
}

.description h4 {
  text-transform: uppercase;
}

input {
  display: none;
}

input:checked + label {
  width: 600px;
}

input:checked + label .description {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

.card[for="c1"] {
  background-image: url("/img/OPT/000805-20190727@090508-L2-S.jpg");
}
.card[for="c2"] {
  background-image: url("/img/OPT/011339-20201124@111236-L3-S.jpg");
}
.card[for="c3"] {
  background-image: url("/img/OPT/000805-20190727@090508-L2-S.jpg");
}
.card[for="c4"] {
  background-image: url("/img/OPT/000805-20190727@090508-L2-S.jpg");
}
</style>
