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
    const currentScore = parseInt(scoreBody.text())+1;
    scoreBody.text(currentScore);

    //Set rotate style of scoreboard
    if (scoreBody.css("transform") == "matrix3d(1, 0, 0, 0, 0, 1, -2.44929e-16, 0, 0, 2.44929e-16, 1, 0, 0, 0, 0, 1)"||
    scoreBody.css("transform")=="rotateX(360deg)") {
        scoreBody.css("transform","");
    } else {
        scoreBody.css("transform","rotateX(360deg)");
    }

    //Set serve color of scoreboard
    scoreBody.addClass("serve-score");
    scoreAnother.removeClass("serve-score");


}

function rotate(deg) {
    this.style.WebkitTransform = "rotateX(" + deg + "deg)";
}