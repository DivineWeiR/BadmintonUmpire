function scorePlus(scoreEnd) {
    var scoreBody = $("#" + scoreEnd + "-score");
    scoreBody.text(parseInt(scoreBody.text())+1);
    // scoreBody.innerHTML = parseInt(scoreBody.innerHTML) + 1;
}

function rotate(deg) {
    this.style.WebkitTransform = "rotateX(" + deg + "deg)";
}