let countDownByMinuteProcess;
let countDownProcess;
let countUpProcess;

function startCountDownBySecond(countElementId, stopElementId, seconds) {
    return new Promise(function (resolve, reject) {
        const $countDown = $("#" + countElementId);
        $countDown.text(seconds);
        const $stopBtn = $("#" + stopElementId);
        $stopBtn.click(() => {
            clearInterval(countDownProcess);
            $(".interval-dlg").hide();
            $(".container").removeClass("blur");
            resolve();
        });
        countDownProcess = setInterval(() => {
            seconds--;
            $countDown.text(seconds);
            if (seconds == 0) {
                clearInterval(countDownProcess);
                $(".interval-dlg").hide();
                $(".container").removeClass("blur");
                resolve();
            }
        },1000);
    });

}
function startCountDownBySecond_old($countDown) {
    let countTime = parseInt($countDown.text());

    countDownProcess = setInterval(() => {
        countTime -= 1;
        if (countTime == 0) {
            clearInterval(countDownProcess);
            setTimeout(() => {
                // $(".interval-dlg").hide();
                $(".container").removeClass("blur");
            }, 0);

        }
        $countDown.text(countTime);
    }, 1000);
}

function startCountDownByMinute($countDown) {
    countDownByMinuteProcess = setInterval(() => {
        const $second = $countDown.find(".second");
        const $minute = $countDown.find(".minute");
        let second = parseInt($second.text());
        let minute = parseInt($minute.text());
        if (second == 0) {
            if (minute == 0) {
                clearInterval(countDownByMinuteProcess);
                setTimeout(() => {
                    $countDown.attr("disabled", true);
                    $countDown.find(".seperator").removeClass("active");
                })
                return;
            }
            minute -= 1;
            second = 59;
        } else {
            second -= 1;
        }

        $second.text(fillZero(second));
        $minute.text(fillZero(minute));
    }, 1000);
}
function fillZero(num) {
    return num < 10 ? "0" + num : "" + num;
}
function stopCountDownByMinute($countDown) {
    clearInterval(countDownByMinuteProcess);
}

function resetCountDownBySecond($countDown, countDownSecond = 60) {
    $countDown.text(countDownSecond);
    startCountDownBySecond($countDown);
}

function stopCountDownBySecond($countDown) {
    clearInterval(countDownProcess);
}

function startCountUp($countUp) {
    const start = new Date();
    countUpProcess = setInterval(() => {
        let now = new Date();
        let gap = now - start;
        let second = parseInt(gap / 1000 % 60);
        let minute = parseInt(gap / 1000 / 60 % 60);
        let hour = parseInt(gap / 1000 / 3600 % 24);
        let day = parseInt(gap / 1000 / 24400);
        console.log([day, hour, minute, second]);
        $countUp.empty();
        if (day > 0) {
            $countUp.append($("<span></span>").text(day));
            $countUp.append($("<span></span>").text("天"));
        }
        if (hour > 0) {
            $countUp.append($("<span></span>").text(hour));
            $countUp.append($("<span></span>").text("小时"));
        }
        $countUp.append($("<span></span>").text(minute));
        $countUp.append($("<span></span>").text("分"));
        $countUp.append($("<span></span>").text(second));
        $countUp.append($("<span></span>").text("秒"));
    }, 1000);
}

function stopCountUp() {
    clearInterval(countUpProcess);
}