(function () {
  "use strict";

  function targetDate(value) {
    var target = new Date(value);
    if (Number.isNaN(target.getTime())) throw new Error("The birthday date is not a valid date. Update girlfriend.birthday in the JSON file.");
    return target;
  }

  function remaining(target, now) {
    var milliseconds = Math.max(0, target.getTime() - now);
    var seconds = Math.floor(milliseconds / 1000);
    return {
      milliseconds: milliseconds,
      days: Math.floor(seconds / 86400),
      hours: Math.floor((seconds % 86400) / 3600),
      minutes: Math.floor((seconds % 3600) / 60),
      seconds: seconds % 60,
      reached: milliseconds === 0
    };
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function bind(target, onTick) {
    var timer;
    function tick() {
      var value = remaining(target, Date.now());
      onTick(value);
      if (value.reached) window.clearInterval(timer);
    }
    tick();
    timer = window.setInterval(tick, 1000);
    return function () { window.clearInterval(timer); };
  }

  window.BirthdayCountdown = { targetDate: targetDate, remaining: remaining, pad: pad, bind: bind };
})();
