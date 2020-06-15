var serveOrder = [1, 2, 3, 4];
var serveSequence = "";
var scoreSequence = "";
var playerA1, playerA2, playerB1, playerB2;

var gameType, gameNum, gameScore, maxScore;
var isSingle = true, twoScoreWin = true, changeEnd = true;

var finalGame = false, final2Win = true;
var finalScore, finalMax;

var intervalBetween, intervalInner;//局间间歇，局中间歇
var intervalBetweenTime, intervalInnerTime;//间歇时间

var courtIndex = "", competitionName = "", matchId = "";
var referee = "", umpire = "", serviceJudge = "";

var serve, receive;
var initServe, initReceive, initServeEnd;

var currentGameScore = "", currentMatchScore = "", currentGameIndex = 1;
var duration, p1MedicalStop, p2MedicalStop;

const leftPlayerContainer = $("#left-player");
const rightPlayerContainer = $("#right-player");

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

    $("input[name='game-score']").change(function () {
        $("#score-diy-input").attr("disabled", !$("#score-diy").is(":checked"));
        $("#score-diy-input").attr("required", $("#score-diy").is(":checked"));
    });

    $("input[name='two-win']").change(function () {
        $("#max-score").attr("disabled", !$("#two-win-on").is(":checked"));
        $("#max-score").attr("required", $("#two-win-on").is(":checked"));
    });
    $("input[name='final-game']").change(function () {
        $("#final-score").attr("disabled", !$("#final-game").is(":checked"));
        $("#final-score").attr("required", $("#final-game").is(":checked"));
        $("#final-max").attr("disabled", !$("#final-game").is(":checked") || !$("#final-2win").is(":checked"));
        $("#final-max").attr("required", $("#final-game").is(":checked") && $("#final-2win").is(":checked"));
        $("#final-2win").attr("disabled", !$("#final-game").is(":checked"));
    });

    $("input[name='final-2win']").change(function () {
        $("#final-max").attr("disabled", !$("#final-game").is(":checked") || !$("#final-2win").is(":checked"));
        $("#final-max").attr("required", $("#final-game").is(":checked") && $("#final-2win").is(":checked"));
    });

    $("input[name='interval-inner-on']").change(function () {
        $("#interval-inner").attr("disabled", !$("#interval-inner-on").is(":checked"));
        $("#interval-inner").attr("required", $("#interval-inner-on").is(":checked"));
    });

    $("input[name='interval-between-on']").change(function () {
        $("#interval-between").attr("disabled", !$("#interval-between-on").is(":checked"));
        $("#interval-between").attr("required", $("#interval-between-on").is(":checked"));
    });

}
function start() {

    //Get match setting
    gameType = $("input[name='game-type']:checked").val();
    if (gameType == "ms" || gameType == "ws") {
        isSingle = true;
    } else {
        isSingle = false;
    }
    gameNum = parseInt($("input[name='game-num']:checked").val());

    gameScore = parseInt($("input[name='game-score']:checked").val());
    if (gameScore == -1) {
        gameScore = parseInt($("input[name='score-diy-input']").val());
    }
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

    intervalInner = $("input[name='interval-inner-on']").is(':checked');
    intervalInnerTime = parseInt($("input[name='interval-inner']").val());
    intervalBetween = $("input[name='interval-between-on']").is(':checked');
    intervalInnerTime = parseInt($("input[name='interval-between']").val());

    courtIndex = parseInt($("input[name='court-index']").val());
    competitionName = $("input[name='competition-name']").val();
    matchId = $("input[name='match-id']").val();
    referee = $("input[name='referee']").val();
    umpire = $("input[name='umpire']").val();
    serviceJudge = $("input[name='service-judge']").val();

    playerA1 = new Player($("input[name='a1-name']").val(), $("input[name='a1-team']").val());
    playerA2 = new Player($("input[name='a2-name']").val(), $("input[name='a2-team']").val());
    playerB1 = new Player($("input[name='b1-name']").val(), $("input[name='b1-team']").val());
    playerB2 = new Player($("input[name='b2-name']").val(), $("input[name='b2-team']").val());

    initReceive = $("input[name='receive']:checked").val();
    initServe = $("input[name='serve']:checked").val();

    currentGameIndex = 1;
    currentMatchScore = "0:0";

    if (initServe == 'a1') {
        serveOrder[0] = 1;
        serveOrder[2] = 2;
        playerA1.setServe("S");
        initServeEnd = "left";
        leftPlayerContainer.html(playerA2.outputHtml() + playerA1.outputHtml());
    } else if (initServe == 'a2') {
        serveOrder[0] = 2;
        serveOrder[2] = 1;
        playerA2.setServe("S");
        initServeEnd = "left";
        leftPlayerContainer.html(playerA1.outputHtml() + playerA2.outputHtml());
    } else if (initServe == 'b1') {
        serveOrder[0] = 3;
        serveOrder[2] = 4;
        playerB1.setServe("S");
        initServeEnd = "right";
        rightPlayerContainer.html(playerB1.outputHtml() + playerB2.outputHtml());
    } else if (initServe == 'b2') {
        serveOrder[0] = 4;
        serveOrder[2] = 3;
        playerB2.setServe("S");
        initServeEnd = "right";
        rightPlayerContainer.html(playerB2.outputHtml() + playerB1.outputHtml());
    }

    if (initReceive == 'a1') {
        serveOrder[3] = 1;
        serveOrder[1] = 2;
        playerA1.setServe("R");
        leftPlayerContainer.html(playerA2.outputHtml() + playerA1.outputHtml());
    } else if (initReceive == 'a2') {
        serveOrder[3] = 2;
        serveOrder[1] = 1;
        playerA2.setServe("R");
        leftPlayerContainer.html(playerA1.outputHtml() + playerA2.outputHtml());
    } else if (initReceive == 'b1') {
        serveOrder[3] = 3;
        serveOrder[1] = 4;
        playerB1.setServe("R");
        rightPlayerContainer.html(playerB1.outputHtml() + playerB2.outputHtml());
    } else if (initReceive == 'b2') {
        serveOrder[3] = 4;
        serveOrder[1] = 3;
        playerB2.setServe("R");
        rightPlayerContainer.html(playerB2.outputHtml() + playerB1.outputHtml());
    }


    $("#s-game-num").text(gameNum);
    $("s-game-score").text(gameScore);
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
    $("#prev-games-score").text(currentGameScore);
    $("#match-score").text(currentMatchScore);

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
    $("#scroll-panel").html(scrollInnerHtml);

    $("#withdraw").attr("disabled", true);
    $(".input-container").hide();
}

// score function
function scorePlus(scoreEnd) {
    let anotherEnd = "";
    if (scoreEnd == "left") {
        anotherEnd = "right";
    } else if (scoreEnd == "right") {
        anotherEnd = "left";
    }
    const scoreBody = $("#" + scoreEnd + "-score");
    const scoreAnother = $("#" + anotherEnd + "-score");
    const serveIcon = $("#serve-icon");

    //Set score
    const currentScore = parseInt(scoreBody.text()) + 1;
    scoreBody.text(currentScore);

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



}

function rotateServeIcon(currentScore, serveEnd) {
    if (currentScore % 2 == 0 && serveEnd == "left") {
        serveIcon.addClass("rotate-northeast");
        serveIcon.removeClass("rotate-southeast");
        serveIcon.removeClass("rotate-southwest");
        serveIcon.removeClass("rotate-northwest");
    } else if (currentScore % 2 == 1 && serveEnd == "left") {
        serveIcon.removeClass("rotate-northeast");
        serveIcon.addClass("rotate-southeast");
        serveIcon.removeClass("rotate-southwest");
        serveIcon.removeClass("rotate-northwest");
    } else if (currentScore % 2 == 0 && serveEnd == "right") {
        serveIcon.removeClass("rotate-northeast");
        serveIcon.removeClass("rotate-southeast");
        serveIcon.addClass("rotate-southwest");
        serveIcon.removeClass("rotate-northwest");
    } else if (currentScore % 2 == 1 && serveEnd == "right") {
        serveIcon.removeClass("rotate-northeast");
        serveIcon.removeClass("rotate-southeast");
        serveIcon.removeClass("rotate-southwest");
        serveIcon.addClass("rotate-northwest");
    }
}

function scrollToBottom(element) {
    const scrollContent = $("." + element);
    const scrollGap = scrollContent[0].scrollHeight-scrollContent[0].clientHeight;
    scrollContent.animate({
        scrollTop: scrollGap
    },800);
}

function sccrollToTop(element) {
    const scrollContent = $("." + element);
    scrollContent.animate({
        scrollTop: 0
    },800);
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
    if (datas.length == 2) {
        outputHtml += "<div class='p1-line'><p>" + datas[0] + "</p></div>";
        outputHtml += "<div class='p2-line'><p>" + datas[1] + "</p></div>";
    } else {
        outputHtml += "<div class='p1-line'><p>" + datas[0] + "</p></div>";
        outputHtml += "<div class='p1-line'><p>" + datas[1] + "</p></div>";
        outputHtml += "<div class='p2-line'><p>" + datas[2] + "</p></div>";
        outputHtml += "<div class='p2-line'><p>" + datas[3] + "</p></div>";
    }
    return outputHtml;
}

class Player {
    constructor(name, team) {
        this.team = team;
        this.name = name;
        this.serve = "";
        this.outputHtml = function () {
            return "<div class='player'><span>" + this.team + "</span><p>" + this.name + "</p></div>";
        };
    }

    /**
     * @param {String} serveMark
     */
    setServe(serveMark) {
        this.serve = serveMark;
    }
}
