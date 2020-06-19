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

let serve, receive;
let initServe, initReceive, initServeEnd;

let prevGamesScore = "", currentMatchScore = "", currentGameIndex = 0;
let duration, p1MedicalStop, p2MedicalStop;
let currentServeEnd = "left";

let hasInterval = false, matchStart = false;

let isLastGame = false;

let p1Injure = false, p2Injure = false;

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
    });

    $("input[name='two-win']").change(() => {
        $("#max-score").attr("disabled", !$("#two-win-on").is(":checked"));
        $("#max-score").attr("required", $("#two-win-on").is(":checked"));
    });
    $("input[name='final-game']").change(() => {
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
        $container.addClass("blur");
        $eventDlg.toggleClass("hidden");
    });

    //后续还会为这些按钮添加其他函数操作，因此这里使用原生js获取按钮
    const eventButtons = document.querySelectorAll(".dlg #cancel, .dlg .btn-group button");
    for (let button of eventButtons) {
        button.addEventListener("click", function () {
            $container.addClass("blur");
            $eventDlg.toggleClass("hidden");
        });
    }


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
    });

    $withdrawBtn.click(() => {
        withdraw();
    });

    $("#p1-injure").click(() => {
        p1Injure = !p1Injure;
        if (p1Injure) {
            startCountDownByMinute($("#p1-injure-time"));
            $("#p1-injure").addClass("active");
            currentScoreSequence += "i";
        } else {
            stopCountDownByMinute($("#p1-injure-time"));
            $("#p1-injure").removeClass("active");
        }
        toggleValue($("#p1-injure p"), "医疗暂停", "继续比赛");
    });
    $("#p2-injure").click(() => {
        p2Injure = !p2Injure;
        if (p2Injure) {
            startCountDownByMinute($("#p2-injure-time"));
            $("#p2-injure").addClass("active");
            currentScoreSequence += "I";
        } else {
            stopCountDownByMinute($("#p2-injure-time"));
            $("#p2-injure").removeClass("active");
        }
        toggleValue($("#p2-injure p"), "医疗暂停", "继续比赛");
    });

    $("#p1-retire").click(() => {
        currentScoreSequence += "r";
        finishGame();
        if (currentGameIndex + 1 != gameNum) {
            finishMatch();
        }
    });
    $("#p2-retire").click(() => {
        currentScoreSequence += "R";
        finishGame();
        if (currentGameIndex + 1 != gameNum) {
            finishMatch();
        }
    });
    $("#p1-yellow-card").click(() => {
        currentScoreSequence += "w";
    });
    $("#p2-yellow-card").click(() => {
        currentScoreSequence += "W";
    });
    $("#p1-red-card").click(() => {
        currentScoreSequence += "f";
        scorePlus("right");
    });
    $("#p2-red-card").click(() => {
        currentScoreSequence += "F";
        scorePlus("left");
    });
    $("#p1-black-card").click(() => {
        currentScoreSequence += "d";
        finishGame();
        if (currentGameIndex + 1 != gameNum) {
            finishMatch();
        }
    });
    $("#p2-black-card").click(() => {
        currentScoreSequence += "D";
        finishGame();
        if (currentGameIndex + 1 != gameNum) {
            finishMatch();
        }
    });

    $("#stop-interval").click(() => {
        $(".container").removeClass("blur");
        stopCountDownBySecond($("#stop-interval"));
        $(".interval-dlg").hide();
    })
}

function startNewGame() {
    if (!matchStart) {
        getMatchOption();
        getPlayerOption();

        currentGameIndex = 0;
        currentMatchScore = "0:0";

        setMatchOption();
        setPlayerOption();
        matchStart = true;
    } else {
        getPlayerOption();

        currentGameIndex++;
        // currentMatchScore = "0:0";

        setPlayerOption();
        if (changeEnd) {
            swapCourtEnd();
        }
    }
    hasInterval = false;
    $prevGamesScore.empty();
    $prevGamesScore.append($("<p></p>").text("0:0"));
    $matchScore.text(currentMatchScore);
    

    $withdrawBtn.attr("disabled", true);
    $(".input-container").hide();
    $gameIndex.text(currentGameIndex + 1);
    startCountUp($("#time-use"));

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
        initServeEnd = "left";
        rotateServeIcon(0, "left");
        currentServeEnd = "left";
        $leftScoreBox.addClass("serve-score");
        $rightScoreBox.removeClass("serve-score");
        $leftPlayerContainer.html(playerA2.outputHtml() + playerA1.outputHtml());
    } else if (initServe == 'a2') {
        serveOrder[0] = 2;
        serveOrder[2] = 1;
        playerA2.setServe("S");
        initServeEnd = "left";
        rotateServeIcon(0, "left");
        currentServeEnd = "left";
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
        initServeEnd = "right";
        rotateServeIcon(0, "right");
        currentServeEnd = "right";
        $rightScoreBox.addClass("serve-score");
        $leftScoreBox.removeClass("serve-score");
        $rightPlayerContainer.html(playerB1.outputHtml() + playerB2.outputHtml());
    } else if (initServe == 'b2') {
        serveOrder[0] = 4;
        serveOrder[2] = 3;
        playerB2.setServe("S");
        initServeEnd = "right";
        rotateServeIcon(0, "right");
        currentServeEnd = "right";
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
        $("#event-playerA").text(playerA1.name);
        $("#event-playerB").text(playerB1.name);
        $("#names-col").html(generateScoreTableColumn([playerA1.name, playerB1.name]));
        $("#serves-col").html(generateScoreTableColumn([playerA1.serve, playerB1.serve]));
        scores = ["", ""];
    } else {
        $("#event-playerA").text(playerA1.name + "&" + playerA2.name);
        $("#event-playerB").text(playerB1.name + "&" + playerB2.name);
        $("#names-col").html(generateScoreTableColumn([playerA1.name, playerA2.name, playerB1.name, playerB2.name]));
        $("#serves-col").html(generateScoreTableColumn([playerA1.serve, playerA2.serve, playerB1.serve, playerB2.serve]));
        scores = ["", "", "", ""];
    }
    for (let i = 1; i <= 2 * maxScore; i++) {
        scrollInnerHtml += "<div class='single-score' id='score-" + i + "'>" + generateScoreTableColumn(scores) + "</div>";
    }
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
    let anotherEnd = "";
    if (scoreEnd == "left") {
        anotherEnd = "right";
        if (scoreEnd == currentServeEnd) {
            swapLeftContent();
            if (isSingle) {
                swapRightContent();
            }
        }
        currentScoreSequence += "0";
    } else if (scoreEnd == "right") {
        anotherEnd = "left";
        if (scoreEnd == currentServeEnd) {
            swapRightContent();
            if (isSingle) {
                swapLeftContent();
            }
        }
        currentScoreSequence += "1";
    }
    const scoreBody = $("#" + scoreEnd + "-score");
    const scoreAnother = $("#" + anotherEnd + "-score");



    //Set score
    const currentScore = parseInt(scoreBody.text()) + 1;
    scoreBody.text(currentScore);
    const anotherScore = parseInt(scoreAnother.text());
    if (isSingle) {
        if (scoreEnd != currentServeEnd && (currentScore + anotherScore) % 2 == 1) {
            swapRightContent();
            swapLeftContent();
        }
    }

    //Set rotate style of scoreboard
    if (scoreBody.css("transform") == "matrix3d(1, 0, 0, 0, 0, 1, -2.44929e-16, 0, 0, 2.44929e-16, 1, 0, 0, 0, 0, 1)" ||
        scoreBody.css("transform") == "rotateX(360deg)") {
        scoreBody.css("transform", "");
    } else {
        scoreBody.css("transform", "rotateX(360deg)");
    }

    //Set serve color of scoreboard
    scoreBody.addClass("serve-score");
    scoreAnother.removeClass("serve-score");

    //Set serve-icon direction
    rotateServeIcon(currentScore, scoreEnd);
    if (scoreEnd != currentServeEnd) {
        serveOrderIndex = (serveOrderIndex + 1) % 4;
    }
    const $singleScore = $scoreScrollPanel.children().eq(currentScoreSequence.length - 1);
    $singleScore.children().eq(serveOrder[serveOrderIndex] - 1).children('p').text(currentScore);
    if ($singleScore[0].offsetLeft - $scoreScrollContainer[0].clientWidth / 2 >= 0) {
        // let scrollGap = $singleScore[0].offsetLeft - $scoreScrollContainer[0].clientWidth;
        $scoreScrollContainer.animate({
            scrollLeft: $singleScore[0].offsetLeft - $scoreScrollContainer[0].clientWidth / 2
        });
    }
    console.log(currentScoreSequence);
    if ((currentScore >= gameScore && currentScore - anotherScore == (twoScoreWin ? 2 : 0)) || currentScore == maxScore ||
        (finalGame && isLastGame && ((currentScore >= finalScore && currentScore - anotherScore == (final2Win ? 2 : 0)) || currentScore == finalMax))) {
        finishGame();
    }
    if (!hasInterval && ((currentScore == intervalScore && intervalInner) ||
        (finalGame && isLastGame && currentScore == finalInterval && intervalInner))) {
        resetCountDownBySecond($intervalCountDown, intervalInnerTime);
        hasInterval = true;
        $(".interval-dlg").show();
        $(".container").addClass("blur");
        startCountDownBySecond($intervalCountDown);
    }

    if (isLastGame && ((!finalGame && currentScore == intervalScore) || (finalGame && currentScore == finalInterval)) && changeEnd) {
        swapCourtEnd();
    }
    currentServeEnd = scoreEnd;
    $withdrawBtn.attr("disabled", false);
}

function withdraw() {
    let curServeEnd = currentScoreSequence.substr(-1, 1);
    let prevServeEnd = currentScoreSequence.substr(-2, 1);
    currentScoreSequence = currentScoreSequence.substr(0, currentScoreSequence.length - 1);
    console.log(currentServeEnd, currentScoreSequence);

    if (currentScoreSequence.length == 0) {
        $withdrawBtn.attr("disabled", true);
    }
    let scoreBody;
    let prevScoreBody;
    console.log(serveOrderIndex);
    if (curServeEnd == '0') {
        scoreBody = $leftScoreBox;
        if (curServeEnd == prevServeEnd) {
            prevScoreBody = scoreBody;
        } else {
            prevScoreBody = $rightScoreBox;
            serveOrderIndex = (serveOrderIndex - 1) % 4;
        }
    } else {
        scoreBody = $rightScoreBox;
        if (curServeEnd == prevServeEnd) {
            prevScoreBody = scoreBody;
        } else {
            prevScoreBody = $leftScoreBox;
            serveOrderIndex = (serveOrderIndex - 1) % 4;
        }
    }
    console.log(serveOrderIndex);
    //改变得分
    let currentScore = parseInt(scoreBody.text()) - 1;
    
    let prevScore = parseInt(prevScoreBody.text());
    scoreBody.text(currentScore);

    if (isSingle) {
        if (curServeEnd == prevServeEnd || (curServeEnd != prevServeEnd && (parseInt($leftScoreBox) + parseInt($rightScoreBox)) % 2 == 0)) {
            swapRightContent();
            swapLeftContent();
        }
    } else {
        if (curServeEnd == prevServeEnd) {
            if (curServeEnd == '1') {
                swapRightContent();
            } else {
                swapLeftContent();
            }
        }
    }
    //Set rotate style of scoreboard
    if (scoreBody.css("transform") == "matrix3d(1, 0, 0, 0, 0, 1, -2.44929e-16, 0, 0, 2.44929e-16, 1, 0, 0, 0, 0, 1)" ||
        scoreBody.css("transform") == "rotateX(360deg)") {
        scoreBody.css("transform", "");
    } else {
        scoreBody.css("transform", "rotateX(360deg)");
    }

    //Set serve color of scoreboard
    scoreBody.removeClass("serve-score");
    prevScoreBody.addClass("serve-score");

    if (isLastGame && ((!finalGame && currentScore == intervalScore - 1) || (finalGame && currentScore == finalInterval - 1)) && changeEnd) {
        swapCourtEnd();
    }

    rotateServeIcon(prevScore, prevServeEnd);
    const $singleScore = $scoreScrollPanel.children().eq(currentScoreSequence.length);
    $singleScore.children().children('p').text("");
    if ($singleScore[0].offsetLeft - $scoreScrollContainer[0].clientWidth / 2 >= 0) {
        // let scrollGap = $singleScore[0].offsetLeft - $scoreScrollContainer[0].clientWidth;
        $scoreScrollContainer.animate({
            scrollLeft: $singleScore[0].offsetLeft - $scoreScrollContainer[0].clientWidth / 2
        });
    }
}
function swapCourtEnd() {
    swapContent($leftPlayerContainer);
    swapContent($rightPlayerContainer);
    const leftPlayerInfo = $leftPlayerContainer.html();
    const rightPlayerInfo = $rightPlayerContainer.html();

    const leftScoreInfo = $leftScoreBox.text();
    const rightScoreInfo = $rightScoreBox.text();

    $leftPlayerContainer.html(rightPlayerInfo);
    $rightPlayerContainer.html(leftPlayerInfo);

    $leftScoreBox.text(rightScoreInfo);
    $rightScoreBox.text(leftScoreInfo);
    $leftScoreBox.toggleClass("serve-score");
    $rightScoreBox.toggleClass("serve-score");

    currentServeEnd = (currentServeEnd == "left") ? "right" : "left";
    rotateServeIcon((currentServeEnd == "left") ? leftScoreInfo : rightScoreInfo, currentServeEnd);

    currentScoreSequence = reverseScoreSequence(currentScoreSequence);

}

function finishGame() {
    var ok = confirm("确定结束该局比赛？");
    if (ok) {
        if (totalScoreSequence.substr(-1, 1) == '0') {
            currentMatchScore = swapScore((parseInt(currentMatchScore.split(":")[0]) + 1) + ":" + currentMatchScore.split(":")[1]);
        } else {
            currentMatchScore = swapScore(currentMatchScore.split(":")[0] + ":" + (parseInt(currentMatchScore.split(":")[1]) + 1));
        }

        const leftScore = $leftScoreBox;
        const rightScore = $rightScoreBox;

        prevGamesScore += leftScore + ":" + rightScore;

        let newPrevGamesScore = "";
        $prevGamesScore.empty();
        for (let gameScore_ of prevGamesScore.split(" ")) {
            newPrevGamesScore += swapScore(gameScore_);
            $prevGamesScore.append($("<p></p>").text(swapScore(gameScore_)));
        }
        prevGamesScore = newPrevGamesScore;
        if (currentGameIndex % 2 == 1 || isLastGame)
            currentScoreSequence = reverseScoreSequence(currentScoreSequence);
        totalScoreSequence += currentScoreSequence + ";";
        if (isLastGame) {
            finishMatch();
        }

        currentGameIndex++;
        if (currentGameIndex + 1 == gameNum) {
            isLastGame == true;

        }

        if (intervalBetween) {
            resetCountDownBySecond($intervalCountDown, intervalBetweenTime);
            $(".interval-dlg").show();
            startCountDownBySecond($intervalCountDown);
            setTimeout(() => {
                startNewGame();
            }, 0);
        }

    }
}

function finishMatch() {
    var ok = confirm("确定结束该场比赛？");
    if (ok) {
        let matchInfo = {
            players: {
                playerA: (isSingle) ? [playerA1, playerA2] : [playerA1],
                playerB: (isSingle) ? [playerB1, playerB2] : [playerB1]
            },
            gameScores: totalScoreSequence,
            matchScores: currentMatchScore,
            time: $("#time-use").html().replace(/<.*>/g, "")
        }

        localStorage[matchId] = JSON.stringify(matchInfo);
    }
}
function swapContent($element) {
    let $children = $element.children();
    let $firstChild = $children[0];
    let $secondChild = $children[1];
    $element.empty();
    $element.append($secondChild).append($firstChild);
}

function swapLeftContent(){
    $leftPlayerContainer.fadeOut(500, () => {
        swapContent($leftPlayerContainer);
        $leftPlayerContainer.fadeIn(500);
    });
}


function swapRightContent(){
    $rightPlayerContainer.fadeOut(500, () => {
        swapContent($rightPlayerContainer);
        $rightPlayerContainer.fadeIn(500);
    });
}

function rotateServeIcon(currentScore, serveEnd) {
    if (serveEnd == '0') {
        serveEnd = "left";
    } else if (serveEnd == '1') {
        serveEnd == "right";
    }
    if (currentScore % 2 == 0 && serveEnd == "left") {
        $serveIcon.addClass("rotate-northeast");
        $serveIcon.removeClass("rotate-southeast");
        $serveIcon.removeClass("rotate-southwest");
        $serveIcon.removeClass("rotate-northwest");
    } else if (currentScore % 2 == 1 && serveEnd == "left") {
        $serveIcon.removeClass("rotate-northeast");
        $serveIcon.addClass("rotate-southeast");
        $serveIcon.removeClass("rotate-southwest");
        $serveIcon.removeClass("rotate-northwest");
    } else if (currentScore % 2 == 0 && serveEnd == "right") {
        $serveIcon.removeClass("rotate-northeast");
        $serveIcon.removeClass("rotate-southeast");
        $serveIcon.addClass("rotate-southwest");
        $serveIcon.removeClass("rotate-northwest");
    } else if (currentScore % 2 == 1 && serveEnd == "right") {
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

function radioProtect(clickId) {
    let idSplit = clickId.split('-');
    if (idSplit[1] == 'serve') {
        idSplit[1] = 'receive';
    } else {
        idSplit[1] = 'serve';
    }

    let newId = '#' + idSplit[0] + '-' + idSplit[1];
    $(newId).prop({ checked: false });
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

function swapLetter(str, l1, l2) {
    str = str.replace(new RegExp(l1,'g'), '#');
    str = str.replace(new RegExp(l2,'g'), l1);
    str = str.replace(new RegExp('#','g'), l2);
    return str;
}

class Player {
    constructor(name, team) {
        this.team = team;
        this.name = name;
        this.serve = "";
        this.transparent = "";
        this.outputHtml = function () {
            return "<div class='player" + this.transparent + "'><span>" + this.team + "</span><p>" + this.name + "</p></div>";
        };
    }

    /**
     * @param {String} serveMark
     */
    setServe(serveMark) {
        this.serve = serveMark;
    }

    setTransparent() {
        this.transparent = " transparent";
    }
}

