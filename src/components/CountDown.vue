<template>
  <div class="d-flex justify-content-center countdown-timer">
    <div class="d-flex flex-column">
      <div class="--time">{{ daysSpan }}.</div>
      <div class="--time-info">Days</div>
    </div>
    <div class="d-flex flex-column">
      <div class="--time">{{ hoursSpan }}.</div>
      <div class="--time-info">Hrs</div>
    </div>
    <div class="d-flex flex-column">
      <div class="--time">{{ minutesSpan }}.</div>
      <div class="--time-info">Min</div>
    </div>
    <div class="d-flex flex-column">
      <div class="--time">{{ secondsSpan }}</div>
      <div class="--time-info">Sec</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, mixins, Options } from "vue-class-component";

class Props {
  countDownEndTime!: number;
}

class BaseClass extends Vue.with(Props) {}

@Options({
  props: {
    countDownEndTime: {
      type: Number,
      required: true,
    },
  },
})
export default class CountDownTimer extends mixins(BaseClass) {
  INTERVAL = 1000;
  timeInterval = null;
  daysSpan = null;
  hoursSpan = null;
  minutesSpan = null;
  secondsSpan = null;

  getTimeRemaining(endtime) {
    var t = (endtime * 1000) - Date.parse(new Date().toString());
    if(t < 1) {
      return {
        total: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  initializeClock() {
    this.updateClock();
    this.timeInterval = setInterval(this.updateClock, this.INTERVAL);
  }

  updateClock() {
    var t = this.getTimeRemaining(this.countDownEndTime);
    this.daysSpan = ("0" + t.days).slice(-2);
    this.hoursSpan = ("0" + t.hours).slice(-2);
    this.minutesSpan = ("0" + t.minutes).slice(-2);
    this.secondsSpan = ("0" + t.seconds).slice(-2);
    if (t.total <= 0) {
      clearInterval(this.timeInterval);
    }
  }

  mounted() {
    this.initializeClock();
  }
}
</script>
<style lang="scss" scoped>
.countdown-timer {
  color: #333333;

  .--time {
    font-size: 2rem;
    line-height: 2.15rem;
    font-weight: 400;
  }
  .--time-info {
    text-align: center;
    font-size: 12px;
    color: #2AC40D;
  }
}
</style>