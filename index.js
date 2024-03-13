var fullScreen = false, voteGoing = true;
var btnOn = "#7FFF00", btnOff = "#E0FFEE", btnInactive = "#C0CCBE"; //btnOff = "#F8F8FF";#80f1b3
var totalMembers = 50, votingMembers = 50, countedVotes = 0, maxVotes = 1, tempWhite = 0, whiteVotes = 0;
var votes = [0, 0, 0, 0, 0, 0];
var namesCheck = [false, false, false, false, false, false];
var names = [getEl("btn0"), getEl("btn1"), getEl("btn2"), getEl("btn3"), getEl("btn4"), getEl("btn5")];
var proBars = [getEl("pro0"), getEl("pro1"), getEl("pro2"), getEl("pro3"), getEl("pro4"), getEl("pro5")];
var voteLabels = [getEl("vt0"), getEl("vt1"), getEl("vt2"), getEl("vt3"), getEl("vt4"), getEl("vt5")];
var lbTempWhites = getEl("lblTempWhites");
var whiteVot = getEl("lbWhites");
var lbCount = getEl("lbTotalCount");
var proCount = getEl("proCont");
var proCountText = getEl("proContText");

function countVotes() {
    if (voteGoing) {
        if (tempWhite == maxVotes) {
            /* if (confirm("Confirmar um voto nulo ou em branco?")){ endRound(); } */
            pauseP(true);
        } else {
            for (let i = 0; i < names.length; i++) {
                if (namesCheck[i] == true) {
                    votes[i]++;
                    voteLabels[i].innerHTML = votes[i];
                    proBars[i].style.width = getPercent(votes[i], votingMembers) + "%";
                    proBars[i].innerHTML = getPercent(votes[i], votingMembers).toFixed(2) + "%";
                }
                namesCheck[i] = false;
                names[i].style.backgroundColor = btnOff;
                names[i].disabled = false;
            }
            endRound();
        }
    }
}
function endRound() {
    whiteVotes += Number(tempWhite);
    whiteVot.innerHTML = whiteVotes;
    tempWhite = Number(maxVotes);
    countedVotes++;
    updateCounted();
    proCount.style.width = getPercent(countedVotes, votingMembers) + "%";
    lbCount.innerHTML = countedVotes * maxVotes;
    if (countedVotes >= votingMembers) {
        tempWhite = 0;
        voteGoing = false;
        getEl("btnVote").disabled = true;
        getEl("votebtns").style.display = 'none';
        getEl("endd").hidden = false;
    }
    updateWhiteText();
}
function pauseP(bol) {
    getEl("bVote").hidden = Boolean(bol);
    getEl("checkWhite").hidden = Boolean(!bol);
    for (let i = 0; i < names.length; i++) {
        names[i].disabled = Boolean(bol);
        if (bol) {
            names[i].style.backgroundColor = btnInactive;
        } else {
            names[i].style.backgroundColor = btnOff;
        }
    }
}
function checkConfirm(bol) {
    if (bol) {
        endRound();
    }
    pauseP(false);
}

function changeState(num) {
    if (voteGoing) {
        if (namesCheck[num] == false) {
            names[num].style.backgroundColor = btnOn;
            namesCheck[num] = true;
            tempWhite--;
            if (tempWhite == 0) {
                toggleNames(true);
            }
        } else {
            namesCheck[num] = false;
            names[num].style.backgroundColor = btnOff;
            tempWhite++;
            if (tempWhite == 1) {
                toggleNames(false);
            }
        }
        updateWhiteText();
    }
}
function toggleNames(bol) {
    for (let i = 0; i < names.length; i++) {
        if (namesCheck[i] == false) {
            names[i].disabled = bol;
            if (bol) {
                names[i].style.backgroundColor = btnInactive;
            } else {
                names[i].style.backgroundColor = btnOff;
            }
        }
    }
}

function updateWhiteText() {
    if (tempWhite == 0) {
        lbTempWhites.style.color = "#FF0000";
    } else {
        lbTempWhites.style.color = "#000000";
    }
    lbTempWhites.innerHTML = tempWhite + " voto(s) restantes nesta cédula.";
}
function updateCounted() {
    proCountText.innerHTML = countedVotes + " / " + votingMembers + getPercentText(countedVotes, votingMembers) + " dos membros presentes contabilizados.";
}


function startVoting() {
    /* names[0].innerHTML = "0";
    names[1].innerHTML = "1";
    names[2].innerHTML = "2";
    names[3].innerHTML = "3";
    names[4].innerHTML = "4";
    names[5].innerHTML = "5";
 */
    let startcheck = 0;
    for (let i = 0; i < names.length; i++) {
        if (names[i].innerHTML) {
            startcheck++;
        }
    }
    if (startcheck < maxVotes) {
        //alert("Para " + maxVotes + " voto(s) por membro, você precisa de pelo menos " + (Number(maxVotes) + 1) + " Candidatos!");
        getEl("btnStart").innerHTML = "Para " + maxVotes + " voto(s) por membro, você precisa de pelo menos " + Number(maxVotes) + " Candidatos!";
        getEl("btnStart").style.color = "#FF0000";
        getEl("btnStart").style.backgroundColor = "#B0FFA1";
        setTimeout(
            () => {
                getEl("btnStart").innerHTML = "Iniciar";
                getEl("btnStart").style.color = "#000000";
                getEl("btnStart").style.backgroundColor = "#B0FFA1";
            },
            4 * 1000
        );
    } else {
        let namToHide = [getEl("n0"), getEl("n1"), getEl("n2"), getEl("n3"), getEl("n4"), getEl("n5")];
        for (let i = 0; i < names.length; i++) {
            if (!names[i].innerHTML) {
                namToHide[i].hidden = true;
            } else {
                proBars[i].style.width = 0;
                proBars[i].innerHTML = "";
                names[i].style.backgroundColor = btnOff;
            }
        }
        tempWhite = Number(maxVotes);
        updateWhiteText();
        updateCounted();
        proCount.style.width = 0;
        getEl("proFull").style.width = getPercent(votingMembers, totalMembers) + "%";
        let tempA = votingMembers * 100 / totalMembers;
        if (tempA < 30) {
            getEl("proFull").style.backgroundColor = "#FF0000"; //accentColor
        } else if (tempA < 60) {
            getEl("proFull").style.backgroundColor = "#FFFF00";
        } else {
            getEl("proFull").style.backgroundColor = "#008000";
        }
        getEl("lbProF").innerHTML = votingMembers + " / " + totalMembers + getPercentText(votingMembers, totalMembers) + " dos membros presentes nesta assembl&eacute;ia";
        if (getEl("setuptitle").value != "") {
            getEl("title").innerHTML = getEl("setuptitle").value;
        } else {
            getEl("tit").hidden = true;
        }
        getEl("setupVote").hidden = true;
        getEl("mainVote").hidden = false;
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
}

function changeTotalMembers(num) {
    totalMembers = Math.min(Math.max(totalMembers += num, 10), 500);
    if (votingMembers > totalMembers) votingMembers = totalMembers;
    updateMembers();
}
function changeVotingMembers(num) {
    votingMembers = Math.min(Math.max(votingMembers += num, 10), 500);
    if (totalMembers < votingMembers)  totalMembers = votingMembers;
    updateMembers();
}
function updateMembers(num1, num2) {
    getEl("totMem").innerHTML = totalMembers;
    getEl("votMem").innerHTML = votingMembers;
}
function changeMaxVotes(num) {
    maxVotes = Math.min(Math.max(maxVotes += num, 1), 5);
    getEl("maxVot").innerHTML = maxVotes;
}
function changeName(num, newName) {
    names[num].innerHTML = newName;
}

function openFullscreen() {
    if (fullScreen) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen(); /* Safari */
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen(); /* IE11 */
        }
        fullScreen = false;
        getEl("btnFullScreen").innerHTML = "Tela cheia";
    } else {
        var elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen(); /* Safari */
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen(); /* IE11 */
        }
        fullScreen = true;
        getEl("btnFullScreen").innerHTML = "Sair da tela cheia";
    }
}

function getPercentText(n1, n2) {
    return " (" + getPercent(n1, n2).toFixed(2) + "%)";
}
function getPercent(n1, n2) {
    return (n1 * 100 / n2);
}
function getEl(id) {
    return document.getElementById(id);
}
window.onbeforeunload = function () {
    return "Tem certeza que deseja sair da votação?";
}
//document.onselectstart = new Function("return false")