import Stack from './stack.js';
import { Player, Event } from './model.js';

let serveOrder = [2, 4, 1, 3];
let serveOrderIndex = 0;
let currentScoreSequence = "";
let totalScoreSequence = "";
let playerA1, playerA2, playerB1, playerB2;

let gameType, gameNum, gameScore, maxScore, intervalScore;
let isSingle = true, twoScoreWin = true, changeEnd = true;

let finalGame = false, final2Win = true;
let finalScore, finalMax, finalInterval;

let intervalBetween, intervalInner;//局间间歇，局中间歇
let intervalBetweenTime, intervalInnerTime;//间歇时间

let courtIndex = "", competitionName = "", matchId = "";
let referee = "", umpire = "", serviceJudge = "";

let initServe, initReceive, initServeEnd;

let prevGamesScore = "", currentMatchScore = "", currentGameIndex = 0;

let matchStart = false;

let isLastGame = false;

let p1Injure = false, p2Injure = false;

let eventRecording = new Stack();

//调试时使用
let debugging = true;

const $leftPlayerContainer = $("#left-player");
const $rightPlayerContainer = $("#right-player");
const $serveIcon = $("#serve-icon");

const $scoreScrollContainer = $(".score-panel");
const $scoreScrollPanel = $("#scroll-panel");

const $settingScrollContainer = $(".input-wrapper");
const $settingScrollPanel = $(".input-scroll");
const $eventRecordBtn = $("#event-record");
const $container = $(".container");
const $eventDlg = $(".event-dlg");
const $hintBtn = $("#hint-btn");

const $bottomShadow = $(".bottom-shadow");
const $scrollTopBtn = $(".scroll-top");

const $nextBtn = $("#next-btn");
const $prevBtn = $("#prev-btn");

const $withdrawBtn = $("#withdraw");

const $prevGamesScore = $("#prev-games-score");
const $matchScore = $("#match-score");
const $gameIndex = $("#s-game-index");

const $leftScoreBox = $("#left-score");
const $rightScoreBox = $("#right-score");

const $intervalCountDown = $("#interval-count-down");

window.onload = function () {
    initSettingPanel();
    initMainPanel();
}

function initSettingPanel() {
    $("#score-diy-input").attr("disabled", !$("#score-diy").is(":checked"));
    $("#max-score").attr("disabled", !$("#two-win-on").is(":checked"));
    $("#max-score").attr("required", $("#two-win-on").is(":checked"));
    $("#final-score").attr("disabled", !$("#final-game").is(":checked"));
    $("#final-score").attr("required", $("#final-game").is(":checked"));
    $("#final-2win").attr("disabled", !$("#final-game").is(":checked"));
    $("#final-max").attr("disabled", !$("#final-game").is(":checked"));
    $("#final-max").attr("required", $("#final-game").is(":checked"));
    $("#interval-inner").attr("disabled", !$("#interval-inner-on").is(":checked"));
    $("#interval-inner").attr("required", $("#interval-inner-on").is(":checked"));

    $("input[name='game-score']").change(() => {
        $("#score-diy-input").attr("disabled", !$("#score-diy").is(":checked"));
        $("#score-diy-input").attr("required", $("#score-diy").is(":checked"));
        if (!$("#score-diy").is(":checked")) {
            let gameScore = parseInt($("#score-diy").is(":checked") ? $("#score-diy-input").val() : $("input[name='game-score']:checked").val());
            let addOn = Math.floor(gameScore / 2) - 1;
            $("#max-score").val(gameScore + addOn);
        }
    });

    $("input[name='score-diy-input']").blur(() => {
        let gameScore = parseInt($("#score-diy").is(":checked") ? $("#score-diy-input").val() : $("input[name='game-score']:checked").val());
        let addOn = Math.floor(gameScore / 2) - 1;
        $("#max-score").val(gameScore + addOn);
    })

    $("input[name='two-win']").change(() => {
        $("#max-score").attr("disabled", !$("#two-win-on").is(":checked"));
        $("#max-score").attr("required", $("#two-win-on").is(":checked"));
    });
    $("input[name='final-game']").change(() => {
        $(".final-label").toggleClass("gray");
        $("#final-score").attr("disabled", !$("#final-game").is(":checked"));
        $("#final-score").attr("required", $("#final-game").is(":checked"));
        $("#final-max").attr("disabled", !$("#final-game").is(":checked") || !$("#final-2win").is(":checked"));
        $("#final-max").attr("required", $("#final-game").is(":checked") && $("#final-2win").is(":checked"));
        $("#final-2win").attr("disabled", !$("#final-game").is(":checked"));
    });

    $("input[name='final-2win']").change(() => {
        $("#final-max").attr("disabled", !$("#final-game").is(":checked") || !$("#final-2win").is(":checked"));
        $("#final-max").attr("required", $("#final-game").is(":checked") && $("#final-2win").is(":checked"));
    });

    $("input[name='interval-inner-on']").change(() => {
        $("#interval-inner").attr("disabled", !$("#interval-inner-on").is(":checked"));
        $("#interval-inner").attr("required", $("#interval-inner-on").is(":checked"));
    });

    $("input[name='interval-between-on']").change(() => {
        $("#interval-between").attr("disabled", !$("#interval-between-on").is(":checked"));
        $("#interval-between").attr("required", $("#interval-between-on").is(":checked"));
    });

}

function initMainPanel() {
    $("#left-plus").click(() => {
        scorePlus('0');
    });
    $("#right-plus").click(() => {
        scorePlus("1");
    })

    $scoreScrollContainer.scroll(() => {
        if ($scoreScrollContainer[0].scrollLeft > 0) {
            $(".shadow-left").show();
        } else {
            $(".shadow-left").hide();
        }
        if ($scoreScrollContainer[0].scrollLeft > $scoreScrollPanel[0].scrollWidth - $scoreScrollContainer[0].clientWidth - 10) {
            $(".shadow-right").hide();
        } else {
            $(".shadow-right").show();
        }
    });

    if ($settingScrollContainer[0].clientHeight > $settingScrollPanel[0].clientHeight) {
        $bottomShadow.hide();
        $scrollTopBtn.hide();
    }
    $settingScrollContainer.scroll(() => {
        if ($settingScrollContainer[0].scrollTop > 0 || $settingScrollContainer[0].clientHeight > $settingScrollPanel[0].clientHeight) {
            $bottomShadow.hide();
            if ($settingScrollContainer[0].clientHeight > $settingScrollPanel[0].clientHeight) {
                $scrollTopBtn.hide();
            }
            else {
                $scrollTopBtn.show();
            }
        } else {
            $bottomShadow.show();
            $scrollTopBtn.hide();
        }
    });


    $eventRecordBtn.click(() => {
        toggleEventDlg(true);
    });

    $('#cancel').click(() => {
        toggleEventDlg(false);
    });



    $hintBtn.click(() => {
        $(".hint").toggleClass("hidden");
    });

    $nextBtn.click(() => {
        $(".match-setting").hide();
        $(".player-setting").show();
        $scrollTopBtn.hide();
        if ($settingScrollContainer[0].scrollTop > 0 || $settingScrollContainer[0].clientHeight > $settingScrollPanel[0].clientHeight) {
            $bottomShadow.hide();
        } else {
            $bottomShadow.show();
        }
        let tempGameType = $("input[name='game-type']:checked").val();
        if (tempGameType == 'ms' || tempGameType == 'ws') {
            $("#player-a2").hide();
            $("#player-b2").hide();
        } else {
            $("#player-a2").show();
            $("#player-b2").show();
        }
        $("#setting-title").text("选手设置");
    });

    $prevBtn.click(() => {
        $(".match-setting").show();
        $(".player-setting").hide();
        if ($scoreScrollContainer[0].scrollTop > 0 || $scoreScrollContainer[0].clientHeight > $scoreScrollPanel[0].clientHeight) {
            $bottomShadow.hide();
            $scrollTopBtn.show();
        } else {
            $bottomShadow.show();
            $scrollTopBtn.hide();
        }
        $("#setting-title").text("比赛设置");
    });

    $withdrawBtn.click(() => {
        withdraw();
    });

    $("#a1-injure").click(() => {
        p1Injure = !p1Injure;
        if (p1Injure) {
            startCountDownByMinute($("#a1-injure-time"));
            $("#a1-injure-time").addClass("active");
            currentScoreSequence += "i";
            eventRecording.push(new Event(playerA1.name, 0, "INJURY"));

        } else {
            stopCountDownByMinute($("#a1-injure-time"));
            $("#a1-injure-time").removeClass("active");
            toggleEventDlg(false);
        }
        toggleValue($("#a1-injure p"), "医疗暂停", "继续比赛");
    });
    $("#a2-injure").click(() => {
        p2Injure = !p2Injure;
        if (p2Injure) {
            startCountDownByMinute($("#a2-injure-time"));
            $("#a2-injure-time").addClass("active");
            currentScoreSequence += "i";
            eventRecording.push(new Event(playerA2.name, 1, "INJURY"));
        } else {
            stopCountDownByMinute($("#a2-injure-time"));
            $("#a2-injure-time").removeClass("active");
            toggleEventDlg(false);
        }
        toggleValue($("#a2-injure p"), "医疗暂停", "继续比赛");
    });
    $("#b1-injure").click(() => {
        p1Injure = !p1Injure;
        if (p1Injure) {
            startCountDownByMinute($("#b1-injure-time"));
            $("#b1-injure-time").addClass("active");
            currentScoreSequence += "I";
            if (isSingle) {
                eventRecording.push(new Event(playerB1.name, 1, "INJURY"));
            } else {
                eventRecording.push(new Event(playerB1.name, 2, "INJURY"));
            }
        } else {
            stopCountDownByMinute($("#b1-injure-time"));
            $("#b1-injure-time").removeClass("active");
            toggleEventDlg(false);
        }
        toggleValue($("#b1-injure p"), "医疗暂停", "继续比赛");
    });
    $("#b2-injure").click(() => {
        p2Injure = !p2Injure;
        if (p2Injure) {
            startCountDownByMinute($("#b2-injure-time"));
            $("#b2-injure-time").addClass("active");
            currentScoreSequence += "I";
            eventRecording.push(new Event(playerB2.name, 3, "INJURY"));
        } else {
            stopCountDownByMinute($("#b2-injure-time"));
            $("#b2-injure-time").removeClass("active");
            toggleEventDlg(false);
        }
        toggleValue($("#b2-injure p"), "医疗暂停", "继续比赛");
    });

    $("#a1-retire").click(() => {
        currentScoreSequence += "r";
        eventRecording.push(new Event(playerA1.name, 0, "RETIRE"));
        finishGame();
        if (!isLastGame) {
            finishMatch();
        }
    });
    $("#a2-retire").click(() => {
        currentScoreSequence += "r";
        eventRecording.push(new Event(playerA2.name, 1, "RETIRE"));
        finishGame();
        if (!isLastGame) {
            finishMatch();
        }
    });
    $("#b1-retire").click(() => {
        currentScoreSequence += "R";
        if (isSingle) {
            eventRecording.push(new Event(playerB1.name, 1, "RETIRE"));
        } else {
            eventRecording.push(new Event(playerB1.name, 2, "RETIRE"));
        }
        finishGame();
        if (!isLastGame) {
            finishMatch();
        }
    });
    $("#b2-retire").click(() => {
        currentScoreSequence += "R";
        eventRecording.push(new Event(playerB2.name, 3, "RETIRE"));
        finishGame();
        if (!isLastGame) {
            finishMatch();
        }
    });

    $("#a1-yellow-card").click(() => {
        currentScoreSequence += "w";
        toggleEventDlg(false);
        updateServeTableBackground(false, 0, true);
        eventRecording.push(new Event(playerA1.name, 0, "WARNING"));
    });
    $("#a2-yellow-card").click(() => {
        currentScoreSequence += "w";
        toggleEventDlg(false);
        updateServeTableBackground(false, 1, true);
        eventRecording.push(new Event(playerA2.name, 1, "WARNING"));
    });
    $("#b1-yellow-card").click(() => {
        currentScoreSequence += "W";
        toggleEventDlg(false);
        let playerIndex = 2;
        if (isSingle) {
            playerIndex /= 2;
        }
        updateServeTableBackground(false, playerIndex, true);
        eventRecording.push(new Event(playerB1.name, playerIndex, "WARNING"));
    });
    $("#b2-yellow-card").click(() => {
        currentScoreSequence += "W";
        toggleEventDlg(false);
        updateServeTableBackground(false, 3, true);
        eventRecording.push(new Event(playerB2.name, 3, "WARNING"));
    });

    $("#a1-red-card").click(() => {
        currentScoreSequence += "f";
        updateServeTableBackground(true, 0, true);
        eventRecording.push(new Event(playerA1.name, 0, "FAULT"));
        scorePlus("1");
        toggleEventDlg(false);
    });
    $("#a2-red-card").click(() => {
        currentScoreSequence += "f";
        updateServeTableBackground(true, 1, true);
        eventRecording.push(new Event(playerA2.name, 1, "FAULT"));
        scorePlus("1");
        toggleEventDlg(false);
    });
    $("#b1-red-card").click(() => {
        currentScoreSequence += "F";
        let playerIndex = 2;
        if (isSingle) {
            playerIndex /= 2;
        }
        updateServeTableBackground(true, playerIndex, true);
        eventRecording.push(new Event(playerB1.name, playerIndex, "FAULT"));
        scorePlus("0");
        toggleEventDlg(false);
    });
    $("#b2-red-card").click(() => {
        currentScoreSequence += "F";
        updateServeTableBackground(true, 3, true);
        eventRecording.push(new Event(playerB1.name, 3, "FAULT"));
        scorePlus("0");
        toggleEventDlg(false);
    });

    $("#a1-black-card").click(() => {
        currentScoreSequence += "d";
        eventRecording.push(new Event(playerA1.name, 0, "DISQUALIFY"));
        finishGame();
        if (!isLastGame) {
            finishMatch();
        }
    });
    $("#a2-black-card").click(() => {
        currentScoreSequence += "d";
        eventRecording.push(new Event(playerA2.name, 1, "DISQUALIFY"));
        finishGame();
        if (!isLastGame) {
            finishMatch();
        }
    });
    $("#b1-black-card").click(() => {
        currentScoreSequence += "D";
        let playerIndex = 2;
        if (isSingle) {
            playerIndex /= 2;
        }
        eventRecording.push(new Event(playerB1.name, playerIndex, "DISQUALIFY"));
        finishGame();
        if (!isLastGame) {
            finishMatch();
        }
    });
    $("#b2-black-card").click(() => {
        currentScoreSequence += "D";
        eventRecording.push(new Event(playerB2.name, 3, "DOISQUALIFY"));
        finishGame();
        if (!isLastGame) {
            finishMatch();
        }
    });

    $("#stop-interval").click(() => {
        $(".container").removeClass("blur");
        stopCountDownBySecond($("#stop-interval"));
        $(".interval-dlg").hide();
    });

    $(".fa-angle-double-up").click(() => {
        scrollToTop('input-wrapper');
    });

    $(".fa-angle-double-down").click(() => {
        scrollToBottom('input-wrapper');
    });

    $(".serve-col").click(function () {
        radioProtect(this.id);
    });

    $(".receive-col").click(function () {
        radioProtect(this.id);
    });

    $("#change-end").click(() => {
        swapLR();
    });
    $("#start-game").click(() => {
        startNewGame();
    })

    $container.addClass("blur");
}

function startNewGame() {
    $container.removeClass("blur");
    getPlayerOption();
    if (initReceive == undefined || initServe == undefined) {
        alert("请选择发接发球员！");
        return;
    }
    $leftScoreBox.text(0);
    $rightScoreBox.text(0);
    currentScoreSequence = "";
    serveOrderIndex = 0;
    if (!matchStart) {
        getMatchOption();

        currentGameIndex = 0;
        currentMatchScore = "0:0";

        setMatchOption();
        setPlayerOption();
        matchStart = true;
        startCountUp($("#time-use"));

        $prevGamesScore.empty();
        $prevGamesScore.append($("<p></p>").text("0:0"));
    } else {
        setPlayerOption();
    }
    $matchScore.text(currentMatchScore);


    $withdrawBtn.attr("disabled", true);
    $(".input-container").hide();
    $gameIndex.text(currentGameIndex + 1);


}


function getMatchOption() {
    //Get match setting
    gameType = $("input[name='game-type']:checked").val();
    if (gameType == "ms" || gameType == "ws") {
        isSingle = true;
    } else {
        isSingle = false;
    }
    gameNum = parseInt($("input[name='game-num']:checked").val());
    if (gameNum == 1) {
        isLastGame = true;
    }

    gameScore = parseInt($("input[name='game-score']:checked").val());
    if (gameScore == -1) {
        gameScore = parseInt($("input[name='score-diy-input']").val());
    }
    intervalScore = Math.ceil(gameScore / 2);
    twoScoreWin = $("input[name='two-win']").is(':checked');
    if (twoScoreWin) {
        maxScore = parseInt($("input[name='max-score']").val());
    } else {
        maxScore = gameScore;
    }
    changeEnd = $("input[name='change-end']").is(':checked');

    finalGame = $("input[name='final-game']").is(':checked');
    final2Win = $("input[name='final-2win']").is(':checked');
    finalScore = parseInt($("input[name='final-score']").val());
    finalMax = parseInt($("input[name='final-max']").val());
    finalInterval = Math.ceil(finalScore / 2);

    intervalInner = $("input[name='interval-inner-on']").is(':checked');
    intervalInnerTime = parseInt($("input[name='interval-inner']").val());
    intervalBetween = $("input[name='interval-between-on']").is(':checked');
    intervalBetweenTime = parseInt($("input[name='interval-between']").val());

    courtIndex = parseInt($("input[name='court-index']").val());
    competitionName = $("input[name='competition-name']").val();
    matchId = $("input[name='match-id']").val();
    referee = $("input[name='referee']").val();
    umpire = $("input[name='umpire']").val();
    serviceJudge = $("input[name='service-judge']").val();
}

function getPlayerOption() {
    playerA1 = new Player($("input[name='a1-name']").val(), $("input[name='a1-team']").val());
    playerA2 = new Player($("input[name='a2-name']").val(), $("input[name='a2-team']").val());
    playerB1 = new Player($("input[name='b1-name']").val(), $("input[name='b1-team']").val());
    playerB2 = new Player($("input[name='b2-name']").val(), $("input[name='b2-team']").val());

    initReceive = $("input[name='receive']:checked").val();
    initServe = $("input[name='serve']:checked").val();
}

// Set only once for each match
function setMatchOption() {
    $("#s-game-num").text(gameNum);
    $("#s-score").text(gameScore);
    if (changeEnd) {
        $("#s-change-end").show();
    } else {
        $("#s-change-end").hide();
    }

    if (twoScoreWin) {
        $("#s-2high-win").show();
        $("#s-max-score").text("封顶" + maxScore + "分");
    } else {
        $("#s-2high-win").hide();
        $("#s-max-score").text("封顶" + gameScore + "分");
    }
    if (!isNaN(courtIndex)) {
        $("#s-court-index").show();
        $("#s-court-index").text(courtIndex + "号场地");
    } else {
        $("#s-court-index").hide();
    }

    $("#s-competition-name").html(competitionName);
    $("#s-game-type").text(getGameTypeName(gameType));
    $("#s-match-id").text(matchId);

}

// Set before each game start
function setPlayerOption() {

    if (isSingle) {
        playerA2.setTransparent();
        playerB2.setTransparent();

    }
    if (initServe == 'a1') {
        if (isSingle) {
            serveOrder = [1, 2, 1, 2];
        } else {
            serveOrder[0] = 1;
            serveOrder[2] = 2;
        }
        playerA1.setServe("S");
        initServeEnd = "0";
        rotateServeIcon(0, "0");
        $leftScoreBox.addClass("serve-score");
        $rightScoreBox.removeClass("serve-score");
        $leftPlayerContainer.html(playerA2.outputHtml() + playerA1.outputHtml());
    } else if (initServe == 'a2') {
        serveOrder[0] = 2;
        serveOrder[2] = 1;
        playerA2.setServe("S");
        initServeEnd = "0";
        rotateServeIcon(0, "0");
        $leftScoreBox.addClass("serve-score");
        $rightScoreBox.removeClass("serve-score");
        $leftPlayerContainer.html(playerA1.outputHtml() + playerA2.outputHtml());
    } else if (initServe == 'b1') {
        if (isSingle) {
            serveOrder = [2, 1, 2, 1];
        } else {
            serveOrder[0] = 3;
            serveOrder[2] = 4;
        }
        playerB1.setServe("S");
        initServeEnd = "1";
        rotateServeIcon(0, "1");
        $rightScoreBox.addClass("serve-score");
        $leftScoreBox.removeClass("serve-score");
        $rightPlayerContainer.html(playerB1.outputHtml() + playerB2.outputHtml());
    } else if (initServe == 'b2') {
        serveOrder[0] = 4;
        serveOrder[2] = 3;
        playerB2.setServe("S");
        initServeEnd = "1";
        rotateServeIcon(0, "1");
        $rightScoreBox.addClass("serve-score");
        $leftScoreBox.removeClass("serve-score");
        $rightPlayerContainer.html(playerB2.outputHtml() + playerB1.outputHtml());
    }

    if (initReceive == 'a1') {
        if (!isSingle) {
            serveOrder[3] = 1;
            serveOrder[1] = 2;
        }
        playerA1.setServe("R");
        $leftPlayerContainer.html(playerA2.outputHtml() + playerA1.outputHtml());
    } else if (initReceive == 'a2') {
        serveOrder[3] = 2;
        serveOrder[1] = 1;
        playerA2.setServe("R");
        $leftPlayerContainer.html(playerA1.outputHtml() + playerA2.outputHtml());
    } else if (initReceive == 'b1') {
        if (!isSingle) {
            serveOrder[3] = 3;
            serveOrder[1] = 4;
        }
        playerB1.setServe("R");
        $rightPlayerContainer.html(playerB1.outputHtml() + playerB2.outputHtml());
    } else if (initReceive == 'b2') {
        serveOrder[3] = 4;
        serveOrder[1] = 3;
        playerB2.setServe("R");
        $rightPlayerContainer.html(playerB2.outputHtml() + playerB1.outputHtml());
    }

    let scores = [];
    let scrollInnerHtml = "";
    if (isSingle) {
        $("#event-name-a1").text(playerA1.name);
        $("#event-name-b1").text(playerB1.name);
        $(".dlg .event-operation").eq(3).remove();
        $(".dlg .event-operation").eq(1).remove();
        $("#names-col").html(generateScoreTableColumn([playerA1.name, playerB1.name]));
        $("#serves-col").html(generateScoreTableColumn([playerA1.serve, playerB1.serve]));
        scores = ["", ""];
    } else {
        $("#event-name-a1").text(playerA1.name);
        $("#event-name-a2").text(playerA2.name);
        $("#event-name-b1").text(playerB1.name);
        $("#event-name-b2").text(playerB2.name);

        $("#names-col").html(generateScoreTableColumn([playerA1.name, playerA2.name, playerB1.name, playerB2.name]));
        $("#serves-col").html(generateScoreTableColumn([playerA1.serve, playerA2.serve, playerB1.serve, playerB2.serve]));
        scores = ["", "", "", ""];
    }
    for (let i = 1; i <= 2 * maxScore; i++) {
        scrollInnerHtml += "<div class='single-score' id='score-" + i + "'>" + generateScoreTableColumn(scores) + "</div>";
    }
    scrollToLeft("score-panel");
    $scoreScrollPanel.html(scrollInnerHtml);


}

function showPlayerSettingPanelOnly() {
    $(".input-container").show();
    $(".match-setting").hide();
    $(".player-setting").show();
    $prevBtn.hide();
}

// score function
function scorePlus(scoreEnd) {
    if (scoreEnd == "0") {
        currentScoreSequence += "0";
    } else if (scoreEnd == "1") {
        currentScoreSequence += "1";
    }
    const scores = updateMainScore(scoreEnd, true);
    const serveScore = scores.serve;
    const receiveScore = scores.receive;
    if (isLastGame && ((!finalGame && serveScore == intervalScore && receiveScore < intervalScore) || (finalGame && serveScore == finalInterval && receiveScore < finalInterval)) && changeEnd) {
        scoreEnd = swapCourtEnd();
        setTimeout(() => { alert("请双方运动员交换场地！") }, 0);
    }

    const currentServeEnd = currentScoreSequence.substr(-1, 1);
    let prevServeEnd = currentScoreSequence.length > 1 ? currentScoreSequence.substr(-2, 1) : initServeEnd;
    if (prevServeEnd != '0' && prevServeEnd != '1') {
        prevServeEnd = currentScoreSequence.length > 2 ? currentScoreSequence.substr(-3, 1) : initServeEnd;
    }
    updateCourt(currentServeEnd, prevServeEnd, true);


    updateServeTable(scoreEnd, true);
    if ((!finalGame || !isLastGame) && (serveScore >= gameScore && (!twoScoreWin || (serveScore - receiveScore >= 2 || serveScore == maxScore))) ||
        ((finalGame && isLastGame) && (serveScore >= finalScore && (!final2Win || (serveScore - receiveScore >= 2 || serveScore == finalMax))))) {
        finishGame();
    }
    if (intervalInner && (((!finalGame || !isLastGame) && serveScore == intervalScore && receiveScore < intervalScore) || (finalGame && isLastGame && serveScore == finalInterval && receiveScore < intervalScore))) {
        $(".interval-dlg").show();
        $(".container").addClass("blur");
        startCountDownBySecond("interval-count-down", "stop-interval", intervalInnerTime);
    }


    updateServeInfo(scoreEnd);
    $withdrawBtn.attr("disabled", false);
}
function withdraw() {
    let curServeEnd = currentScoreSequence.substr(-1, 1);
    let prevServeEnd = currentScoreSequence.substr(-2, 1);
    let tempStore = "";
    currentScoreSequence = currentScoreSequence.substr(0, currentScoreSequence.length - 1);
    if (curServeEnd == 'i' && curServeEnd == 'I') {
        tempStore = curServeEnd;
        curServeEnd = prevServeEnd;
        if (currentScoreSequence.length > 1) {
            prevServeEnd = currentScoreSequence.substr(-2, 1);
        } else {
            prevServeEnd = initServeEnd;
        }
    }
    if (curServeEnd == 'w' || curServeEnd == 'W') {
        let event = eventRecording.pop();
        updateServeTableBackground(false, event.playerIndex, false);
        return;
    }

    if (prevServeEnd == 'f' || prevServeEnd == 'F') {
        let event = eventRecording.pop();
        updateServeTableBackground(true, event.playerIndex, false);
        currentScoreSequence = currentScoreSequence.substr(0, currentScoreSequence.length - 1);
        prevServeEnd = currentScoreSequence.substr(-1, 1);
    }

    if (currentScoreSequence.length == 0) {
        $withdrawBtn.attr("disabled", true);
    }
    const scores = updateMainScore(curServeEnd, false);
    let serveScore;
    let receiveScore;
    if (curServeEnd == prevServeEnd) {
        serveScore = scores.serve;
        receiveScore = scores.receive;
    } else {
        serveScore = scores.receive;
        receiveScore = scores.serve;
    }
    if (isLastGame && ((!finalGame && serveScore == intervalScore - 1 && receiveScore < intervalScore) || (finalGame && currentScore == finalInterval - 1 && receiveScore < finalInterval)) && changeEnd) {
        swapCourtEnd();
        prevServeEnd = reverseScoreSequence(prevServeEnd);
        curServeEnd = reverseScoreSequence(curServeEnd);
    }
    updateCourt(curServeEnd, prevServeEnd, false);
    updateServeTable(curServeEnd, false);
    updateServeInfo(prevServeEnd);
    if (curServeEnd != prevServeEnd) {
        serveOrderIndex = (serveOrderIndex - 1) % 4;
    }
    if (tempStore == "i" || tempStore == 'I') {
        currentScoreSequence += tempStore;
    }
}


/**
 * 
 * @param {boolean} whenScorePlus 是否在加分
 * @returns 当前发球方
 */
function swapCourtEnd() {
    swapLeftContent();
    swapRightContent();
    const leftPlayerInfo = $leftPlayerContainer.html();
    const rightPlayerInfo = $rightPlayerContainer.html();

    const leftScoreInfo = $leftScoreBox.text();
    const rightScoreInfo = $rightScoreBox.text();

    $leftPlayerContainer.html(rightPlayerInfo);
    $rightPlayerContainer.html(leftPlayerInfo);

    $leftScoreBox.text(rightScoreInfo);
    $rightScoreBox.text(leftScoreInfo);

    currentScoreSequence = reverseScoreSequence(currentScoreSequence);
    totalScoreSequence = reverseScoreSequence(totalScoreSequence);
    swapGamesScore();
    currentMatchScore = swapScore(currentMatchScore);
    $matchScore.text(currentMatchScore);
    const serveEnd = currentScoreSequence.substr(-1, 1);
    return serveEnd;
}

function finishGame() {
    var ok = confirm("确定结束该局比赛？");
    if (ok) {
        const lastStatus = currentScoreSequence.substr(-1, 1);
        totalScoreSequence += currentScoreSequence + ";";
        
        if (lastStatus == '0' || lastStatus == 'R' || lastStatus == 'W') {
            currentMatchScore = (parseInt(currentMatchScore.split(":")[0]) + 1) + ":" + currentMatchScore.split(":")[1];
        } else if (lastStatus == '1' || lastStatus == 'r' || lastStatus == 'w') {
            currentMatchScore = currentMatchScore.split(":")[0] + ":" + (parseInt(currentMatchScore.split(":")[1]) + 1);
        }
        let netMatchWin = Math.abs(currentMatchScore.split(":").reduce((x, y) => (x - y)));
        const leftScore = $leftScoreBox.text();
        const rightScore = $rightScoreBox.text();

        prevGamesScore += leftScore + ":" + rightScore;

        if (netMatchWin > (gameNum / 2) || isLastGame) {
            return finishMatch();
        }

        if (changeEnd) {
            swapGamesScore();
            currentMatchScore = swapScore(currentMatchScore);
        }



        currentGameIndex++;
        if (currentGameIndex + 1 == gameNum) {
            isLastGame = true;

        }

        if (intervalBetween) {
            $(".interval-dlg").show();
            startCountDownBySecond("interval-count-down", "stop-interval", intervalBetweenTime).then(() => {
                if (changeEnd) {
                    totalScoreSequence = reverseScoreSequence(totalScoreSequence);
                    swapLR();
                }
                showPlayerSettingPanelOnly();
            });
        } else {
            if (changeEnd) {
                totalScoreSequence = reverseScoreSequence(totalScoreSequence);
                swapLR();
            }
            showPlayerSettingPanelOnly();
        }

    } else {
        withdraw();
    }
}

function finishMatch() {
    var ok = confirm("确定结束该场比赛？");
    if (ok) {
        stopCountUp();
        let matchInfo = {
            players: {
                playerA: (isSingle) ? [playerA1, playerA2] : [playerA1],
                playerB: (isSingle) ? [playerB1, playerB2] : [playerB1]
            },
            gameScores: prevGamesScore,
            matchScores: currentMatchScore,
            time: $("#time-use").text()
        }

        localStorage[matchId] = JSON.stringify(matchInfo);
        let matchResult = "比赛结束, 用时:" + matchInfo.time + "\n";
        matchResult += playerA1.name + (playerA2.name == "" ? "" : ("/" + playerA2.name)) + " VS ";
        matchResult += playerB1.name + (playerB2.name == "" ? "" : ("/" + playerB2.name)) + "\n";
        matchResult += matchInfo.matchScores + "\n";
        matchResult += matchInfo.gameScores;
        alert(matchResult);
        window.location.href = "index.html";
    }
}
function swapContent($element) {
    let $children = $element.children();
    let $firstChild = $children[0];
    let $secondChild = $children[1];
    $element.empty();
    $element.append($secondChild).append($firstChild);
}

function swapLeftContent() {
    if (debugging) {
        swapContent($leftPlayerContainer);
    } else {
        $leftPlayerContainer.fadeOut(500, () => {
            swapContent($leftPlayerContainer);
            $leftPlayerContainer.fadeIn(500);
        });
    }
}


function swapRightContent() {
    if (debugging) {
        swapContent($rightPlayerContainer);
    } else {
        $rightPlayerContainer.fadeOut(500, () => {
            swapContent($rightPlayerContainer);
            $rightPlayerContainer.fadeIn(500);
        });
    }
}

function rotateServeIcon(currentScore, serveEnd) {
    if (currentScore % 2 == 0 && serveEnd == "0") {
        $serveIcon.addClass("rotate-northeast");
        $serveIcon.removeClass("rotate-southeast");
        $serveIcon.removeClass("rotate-southwest");
        $serveIcon.removeClass("rotate-northwest");
    } else if (currentScore % 2 == 1 && serveEnd == "0") {
        $serveIcon.removeClass("rotate-northeast");
        $serveIcon.addClass("rotate-southeast");
        $serveIcon.removeClass("rotate-southwest");
        $serveIcon.removeClass("rotate-northwest");
    } else if (currentScore % 2 == 0 && serveEnd == "1") {
        $serveIcon.removeClass("rotate-northeast");
        $serveIcon.removeClass("rotate-southeast");
        $serveIcon.addClass("rotate-southwest");
        $serveIcon.removeClass("rotate-northwest");
    } else if (currentScore % 2 == 1 && serveEnd == "1") {
        $serveIcon.removeClass("rotate-northeast");
        $serveIcon.removeClass("rotate-southeast");
        $serveIcon.removeClass("rotate-southwest");
        $serveIcon.addClass("rotate-northwest");
    }
}


function scrollToBottom(element) {
    const scrollContent = $("." + element);
    const scrollGap = scrollContent[0].scrollHeight - scrollContent[0].clientHeight;
    scrollContent.animate({
        scrollTop: scrollGap
    }, 800);
}

function scrollToTop(element) {
    const scrollContent = $("." + element);
    scrollContent.animate({
        scrollTop: 0
    }, 800);
}

function scrollToLeft(element) {
    const scrollContent = $("." + element);
    scrollContent.animate({
        scrollLeft: 0
    }, 800);
}

function radioProtect(clickId) {
    let idSplit = clickId.split('-');
    if (idSplit[1] == 'serve') {
        idSplit[1] = 'receive';
    } else {
        idSplit[1] = 'serve';
    }

    const newId = '#' + idSplit[0] + '-' + idSplit[1];
    $(newId).prop({ checked: false });

    const anotherId = '#' + ((idSplit[0].substr(-1, 1) == '1') ? idSplit[0].replace('1', '2') : idSplit[0].replace('2', '1')) + '-' + idSplit[1];
    $(anotherId).prop({ checked: false });
}

function swapLR() {
    let a1Team = $("input[name='a1-team']").val();
    let a1Name = $("input[name='a1-name']").val();
    let a1Serve = $("#a1-serve").is(":checked");
    let a1Receive = $("#a1-receive").is(":checked");

    let a2Team = $("input[name='a2-team']").val();
    let a2Name = $("input[name='a2-name']").val();
    let a2Serve = $("#a2-serve").is(":checked");
    let a2Receive = $("#a2-receive").is(":checked");

    let b1Team = $("input[name='b1-team']").val();
    let b1Name = $("input[name='b1-name']").val();
    let b1Serve = $("#b1-serve").is(":checked");
    let b1Receive = $("#b1-receive").is(":checked");

    let b2Team = $("input[name='b2-team']").val();
    let b2Name = $("input[name='b2-name']").val();
    let b2Serve = $("#b2-serve").is(":checked");
    let b2Receive = $("#b2-receive").is(":checked");

    $("input[name='a1-team']").val(b1Team);
    $("input[name='a1-name']").val(b1Name);
    $("input[name='a2-team']").val(b2Team);
    $("input[name='a2-name']").val(b2Name);

    $("input[name='b1-team']").val(a1Team);
    $("input[name='b1-name']").val(a1Name);
    $("input[name='b2-team']").val(a2Team);
    $("input[name='b2-name']").val(a2Name);

    $("#a1-serve").prop("checked", b1Serve);
    $("#a1-receive").prop("checked", b1Receive);
    $("#a2-serve").prop("checked", b2Serve);
    $("#a2-receive").prop("checked", b2Receive);

    $("#b1-serve").prop("checked", a1Serve);
    $("#b1-receive").prop("checked", a1Receive);
    $("#b2-serve").prop("checked", a2Serve);
    $("#b2-receive").prop("checked", a2Receive);
}

function getGameTypeName(gameType) {
    if (gameType == "ms") {
        return "男单";
    } else if (gameType == "ws") {
        return "女单";
    } else if (gameType == "md") {
        return "男双";
    } else if (gameType == "wd") {
        return "男单";
    } else if (gameType == "xd") {
        return "混双";
    }
}

function generateScoreTableColumn(datas) {
    let outputHtml = "";
    const length = datas.length;
    for (let index in datas) {
        outputHtml += "<div class='p" + ((index < length / 2) ? '1' : '2') + "-line'><p>" + datas[index] + "</p></div>";
    }
    return outputHtml;
}

function toggleValue($element, value1, value2) {
    if ($element.text() == value1) {
        $element.text(value2);
    } else {
        $element.text() == value2;
        $element.text(value1);
    }
}
/**
 * 
 * @param {String} scoreStr 
 * scoreStr is like: 21:19
 */
function swapScore(scoreStr) {
    let scores = scoreStr.split(":");
    return scores[1] + ":" + scores[0];
}

function reverseScoreSequence(scoreSeq) {
    scoreSeq = swapLetter(scoreSeq, '0', '1');
    scoreSeq = swapLetter(scoreSeq, 'i', 'I');//Injury
    scoreSeq = swapLetter(scoreSeq, 'w', 'W');//Warning
    scoreSeq = swapLetter(scoreSeq, 'f', 'F');//Fault
    scoreSeq = swapLetter(scoreSeq, 'r', 'R');//Retire
    scoreSeq = swapLetter(scoreSeq, 'd', 'D');//Disqualify
    return scoreSeq;
}

function swapGamesScore() {
    let newPrevGamesScore = "";
    $prevGamesScore.empty();
    for (let gameScore_ of prevGamesScore.split(" ")) {
        if (gameScore_.indexOf(":") >= 0) {
            newPrevGamesScore += swapScore(gameScore_) + " ";
            $prevGamesScore.append($("<p></p>").text(swapScore(gameScore_)));
        }
    }
    prevGamesScore = newPrevGamesScore;
}

function swapLetter(str, l1, l2) {
    str = str.replace(new RegExp(l1, 'g'), '#');
    str = str.replace(new RegExp(l2, 'g'), l1);
    str = str.replace(new RegExp('#', 'g'), l2);
    return str;
}
/**
 * 
 * @param {string} updateEnd 比分变化的一方
 * @returns {Object} serve:发球方的控件，receive: 接发球方的控件
 */
function getServeEnd(updateEnd) {
    let scoreBody;
    let scoreAnother;

    if (updateEnd == "0") {
        scoreBody = $("#left-score");
        scoreAnother = $("#right-score");
    } else if (updateEnd == "1") {
        scoreBody = $("#right-score");
        scoreAnother = $("#left-score");
    }
    return { serve: scoreBody, receive: scoreAnother };
}
/**
 * 
 * @param {string} updateEnd 比分变化的一方
 * @param {boolean} add 得分为true，撤销为false
 */
function updateMainScore(updateEnd, add = true) {
    const serveInfo = getServeEnd(updateEnd);

    const scoreBody = serveInfo.serve;
    const receiveBody = serveInfo.receive;

    const currentScore = parseInt(scoreBody.text()) + (add ? 1 : -1);
    scoreBody.text(currentScore);

    scoreBody.removeClass("serve-score");
    receiveBody.removeClass("serve-score");
    return { serve: currentScore, receive: parseInt(receiveBody.text()) };
}

/**
 * 
 * @param {string} updateEnd 比分变化的一方
 */
function updateServeInfo(updateEnd) {
    const serveInfo = getServeEnd(updateEnd);

    const scoreBody = serveInfo.serve;
    // 调整发球方
    scoreBody.addClass("serve-score");


    //调整发接法图标
    rotateServeIcon(parseInt(scoreBody.text()), updateEnd);

    //设置发球板翻页动画，现在用css动画实现，删除该部分
    // if (scoreBody.css("transform") == "matrix3d(1, 0, 0, 0, 0, 1, -2.44929e-16, 0, 0, 2.44929e-16, 1, 0, 0, 0, 0, 1)" ||
    //     scoreBody.css("transform") == "rotateX(360deg)") {
    //     scoreBody.css("transform", "");
    // } else {
    //     scoreBody.css("transform", "rotateX(360deg)");
    // }
}

/**
 * 交换一方或双方站位及发球方
 */
function updateCourt(currentServeEnd, prevServeEnd, add = true) {

    if (currentServeEnd == prevServeEnd) {
        if (isSingle) {
            swapLeftContent();
            swapRightContent();
        } else {
            if (currentServeEnd == "0") {
                swapLeftContent();
            } else {
                swapRightContent();
            }
        }
    } else {
        if (isSingle) {
            const totalScore = currentScoreSequence.replace(/[^0-1]+/g, '').length;
            if (totalScore % 2 == 1) {
                swapLeftContent();
                swapRightContent();
            }
        }
        // 更新发球员index
        if (add) {
            serveOrderIndex = (serveOrderIndex + 1) % 4;
        }
    }


}

function updateServeTable(updateEnd, add = true) {
    const scoreBody = getServeEnd(updateEnd).serve;
    let cScore = parseInt(scoreBody.text());
    if (!add) {
        cScore = "";
    }
    let currentTotalScore = currentScoreSequence.replace(/[^0-1]+/g, '').length;
    if (add) {
        currentTotalScore -= 1;
    }
    const $singleScore = $scoreScrollPanel.children().eq(currentTotalScore);
    $singleScore.children().eq(serveOrder[serveOrderIndex] - 1).children('p').text(cScore);
    if ($singleScore[0].offsetLeft - $scoreScrollContainer[0].clientWidth / 2 >= 0) {
        $scoreScrollContainer.animate({
            scrollLeft: $singleScore[0].offsetLeft - $scoreScrollContainer[0].clientWidth / 2
        });
    }
}
/**
 * 
 * @param {boolean} color false为黄色，true为红色
 */
function updateServeTableBackground(color, playerIndex, add = true) {
    let currentTotalScore = currentScoreSequence.replace(/[^0-1]+/g, '').length - 1;
    const $singleScore = $scoreScrollPanel.children().eq(currentTotalScore);
    if (add) {
        currentTotalScore -= 1;
        if (color) {
            $singleScore.children().eq(playerIndex).addClass("red-back");
        } else {
            $singleScore.children().eq(playerIndex).addClass("yellow-back");
        }
    } else {
        if (color) {
            $singleScore.children().eq(playerIndex).removeClass("red-back");
        } else {
            $singleScore.children().eq(playerIndex).removeClass("yellow-back");
        }
    }

}

function toggleEventDlg(flag) {
    if (flag) {
        $container.addClass("blur");
        $eventDlg.removeClass("hidden");
    } else {
        $container.removeClass("blur");
        $eventDlg.addClass("hidden");
    }
}
