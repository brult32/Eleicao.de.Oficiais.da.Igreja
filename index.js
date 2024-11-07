let fullScreen = false, voteGoing = true;
const btnOn = '#7FFF00', btnOff = '#E0FFEE', btnInactive = '#C0CCBE', colorBlack = '#000000', colorRed = '#FF0000', colorYellow = '#FFFF00', colorDarkGreen = '#008000', colorLightGreen = '#B0FFA1', colorLightStart = 'DBFFD4'; //btnOff = '#F8F8FF';#80f1b3
const MAX_VOTES = 500, MIN_VOTES = 6;
let totalMembers = 50, votingMembers = 50, countedVotes = 0, maxVotes = 1, tempWhite = 0, whiteVotes = 0;
const votes = new Array(6).fill(0);
const namesCheck = new Array(6).fill(false);
const names = [getEl('btn0'), getEl('btn1'), getEl('btn2'), getEl('btn3'), getEl('btn4'), getEl('btn5')];
const proBars = [getEl('pro0'), getEl('pro1'), getEl('pro2'), getEl('pro3'), getEl('pro4'), getEl('pro5')];
const voteLabels = [getEl('vt0'), getEl('vt1'), getEl('vt2'), getEl('vt3'), getEl('vt4'), getEl('vt5')];
const lbTempWhites = getEl('lblTempWhites');
const whiteVot = getEl('lbWhites');
const lbCount = getEl('lbTotalCount');
const proCount = getEl('proCont');
const proCountText = getEl('proContText');

function countVotes() {
    if (!voteGoing) return;
    if (tempWhite == maxVotes) {
        /* if (confirm('Confirmar um voto nulo ou em branco?')){ endRound(); } */
        pauseP(true);
    } else {
        names.forEach((name, i) => {
            if (namesCheck[i]) {
                votes[i]++;
                voteLabels[i].innerText = votes[i];
                const percent = getPercent(votes[i], votingMembers);
                proBars[i].style.width = percent + '%';
                proBars[i].innerText = percent.toFixed(2) + '%';
            }
            namesCheck[i] = false;
            changeNameState(name, i, false);
        });
        endRound();
    }
}
function endRound() {
    whiteVotes += Number(tempWhite);
    setText(whiteVot, whiteVotes);
    tempWhite = Number(maxVotes);
    countedVotes++;
    updateCounted(`${getPercent(countedVotes, votingMembers)}'%'`);
    setText(lbCount, countedVotes * maxVotes);
    if (countedVotes >= votingMembers) {
        tempWhite = 0;
        voteGoing = false;
        getEl('btnVote').disabled = true;
        getEl('votebtns').style.display = 'none';
        setVisibility('endd', false);
    }
    updateWhiteText();
}
function pauseP(bol) {
    setVisibility('bVote', Boolean(bol));
    setVisibility('checkWhite', Boolean(!bol));
    names.forEach((name, i) => {
        changeNameState(name, i, Boolean(bol));
    });
}
function checkConfirm(bol) {
    if (bol) { endRound(); }
    pauseP(false);
}
function changeState(num) {
    if (!voteGoing) return;
    if (namesCheck[num] == false) {
        setBGColor(num, btnOn);
        namesCheck[num] = true;
        tempWhite--;
        if (tempWhite == 0) {
            toggleNames(true);
        }
    } else {
        namesCheck[num] = false;
        setBGColor(num, btnOff);
        tempWhite++;
        if (tempWhite == 1) {
            toggleNames(false);
        }
    }
    updateWhiteText();
}
function toggleNames(bol) {
    names.forEach((name, i) => {
        if (!namesCheck[i]) changeNameState(name, i, Boolean(bol));
    });
}
function changeNameState(name, i, bol) {
    name.disabled = bol;
    setBGColor(i, bol ? btnInactive : btnOff);
}
function updateWhiteText() {
    setText(lbTempWhites, tempWhite + ' voto(s) restantes nesta cédula.');
    setTextColor(lbTempWhites, tempWhite == 0 ? colorRed : colorBlack)
}
function updateCounted(percentage) {
    setText(proCountText, countedVotes + ' / ' + votingMembers + getPercentText(countedVotes, votingMembers) + ' dos membros presentes contabilizados.');
    proCount.style.width = percentage;
}

function startVoting() {
    let startcheck = 0;
    for (let i = 0; i < names.length; i++) {
        if (names[i].innerText) { startcheck++; }
    }
    if (startcheck < 2 || startcheck < maxVotes) {
        //alert('Para ' + maxVotes + ' voto(s) por membro, você precisa de pelo menos ' + (Number(maxVotes) + 1) + ' Candidatos!');
        setBtn('Para ' + maxVotes + ' voto(s) por membro, você precisa de pelo menos ' + Number(maxVotes) + ' Candidatos!', colorRed, colorLightGreen);
        setTimeout(() => {
            setBtn('Iniciar', colorBlack, colorLightStart);
        }, 4 * 1000);
    } else {
        let namToHide = [getEl('n0'), getEl('n1'), getEl('n2'), getEl('n3'), getEl('n4'), getEl('n5')];
        names.forEach((name, i) => {
            const isEmpty = !name.innerText;
            namToHide[i].hidden = isEmpty;
            if (!isEmpty) {
                proBars[i].style.width = 0;
                proBars[i].innerText = '';
                setBGColor(i, btnOff);
            }
        });
        tempWhite = Number(maxVotes);
        updateWhiteText();
        updateCounted(0);
        getEl('proFull').style.width = getPercent(votingMembers, totalMembers) + '%';
        let tempA = votingMembers * 100 / totalMembers;
        if (tempA < 30) {
            setBGColor('proFull', colorRed);
        } else if (tempA < 60) {
            setBGColor('proFull', colorYellow);
        } else {
            setBGColor('proFull', colorDarkGreen);
        }
        setText('lbProF', votingMembers + ' / ' + totalMembers + getPercentText(votingMembers, totalMembers) + ' dos membros presentes nesta assembl&eacute;ia');
        if (getEl('setuptitle').value != '') {
            setText('title', getEl('setuptitle').value)
        } else {
            setVisibility('tit', true);
        }
        setVisibility('setupVote', true);
        setVisibility('mainVote', false);
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
}

function changeName(num, newName) {//DOM
    setText(num, newName);
}
function changeTotalMembers(num) {//DOM
    totalMembers = getNewMembers(totalMembers, num);
    if (votingMembers > totalMembers) votingMembers = totalMembers;
    updateMembers();
}
function changeVotingMembers(num) {//DOM
    votingMembers = getNewMembers(votingMembers, num);
    if (totalMembers < votingMembers) totalMembers = votingMembers;
    updateMembers();
}
function getNewMembers(mem, num) {
    return Math.min(Math.max(mem += num, MIN_VOTES), MAX_VOTES);
}
function updateMembers() {
    setText('totMem', totalMembers);
    setText('votMem', votingMembers);
}
function changeMaxVotes(num) { //DOM
    maxVotes = Math.min(Math.max(maxVotes += num, 1), 5);
    setText('maxVot', maxVotes);
}

function openFullscreen() {
    if (fullScreen) {
        const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
        if (exitFullscreen) {
            exitFullscreen.call(document);
        }
        fullScreen = false;
        setText('btnFullScreen', 'Tela cheia');
    } else {
        let elem = document.documentElement;
        const requestFullscreen = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.msRequestFullscreen;
        if (requestFullscreen) {
            requestFullscreen.call(elem);
        }
        fullScreen = true;
        setText('btnFullScreen', 'Sair da tela cheia');
    }
}

function getPercentText(n1, n2) {
    return `(${getPercent(n1, n2).toFixed(2)}%)`;
}
function getPercent(n1, n2) {
    return (n1 * 100 / n2);
}
function setVisibility(id, visible) {
    getEl(id).hidden = visible;
}
function getElementType(element) {
    return (typeof element === 'string') ? getEl(element) : (element instanceof HTMLElement) ? element : names[element];
}
function setText(id, text) {
    getElementType(id).innerText = text;
}
function setTextColor(id, color) {
    getElementType(id).style.color = color;
}
function setBGColor(id, color) {
    getElementType(id).style.backgroundColor = color;
}
function setBtn(text, color, bgcolor) {
    setText('btnStart', text);
    setTextColor('btnStart', color);
    setBGColor('btnStart', bgcolor);
}
function getEl(id) {
    return document.getElementById(id);
}
window.onbeforeunload = function () {
    return 'Tem certeza que deseja sair da votação?';
}
//document.onselectstart = new Function('return false')