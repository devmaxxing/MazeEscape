const STATE_WAITING = 0;
const STATE_ROLE_SELECT = 1;
const STATE_STARTING = 2;
const STATE_PLAYING = 3;

const STATUS_MESSAGES = {
    0: "Waiting for players...",
    1: "Waiting for all players to select a role...",
    2: "Starting game...",
    3: "In game"
}


const ROLE_NONE = 0;
const ROLE_LIBRARIAN = 1;
const ROLE_EXPLORER = 2;

const ROLETEXT = {
    0: "None",
    1: "Librarian",
    2: "Explorer"
}

const ROLEBUTTONS = {
    0: null,
    1: "#btn-lib",
    2: "#btn-run"
}

const ROLESPANS = {
    1: "#lib-btn-span",
    2: "#run-btn-span"
}

var currentState = STATE_WAITING;

var currentRole = ROLE_NONE;
var otherRole = ROLE_NONE;

var ready = false;
var otherReady = false;

let startTime;
let checkVictoryInterval;

function checkVictory() {
    let playerPos = document.querySelector('#playerCamera').object3D.parent.position;
    if (playerPos.x >= 1.3 && playerPos.x <= 1.8 && playerPos.y == 0.19 && playerPos.z > -0.31) {
        NAF.connection.broadcastData("finish", '');
        finish();
    }
}

function setState(state) {
    currentState = state;
    $("#lobby-status").text(STATUS_MESSAGES[currentState]);
}

function syncStart (senderId, dataType, data, targetId) {
    otherReady = data;
    if (otherReady && ready) {
        start();
    }
}

function finish() {
    AFRAME.scenes[0].removeAttribute('networked-scene');
    let endTime = new Date().getTime();
    let totalTimeMinutes = Math.round((endTime-startTime)/60000);
    $('#time-span').html(totalTimeMinutes);
    $('#finish-screen').show();
    $('#game').hide();
    $('#main-div').hide();
    clearInterval(checkVictoryInterval);
}

function start () {
    setState(STATE_STARTING);
    $('#starting-alert-div').slideToggle();
            let counter = 5;
            let interval = setInterval(() => {
                counter--;
                $('#countdown-span').html(counter);
                if (counter == 0) {
                    clearInterval(interval);
                    setState(STATE_PLAYING);
                    initGame();
                    $("#game").removeAttr("hidden");
                }
    },1000);
}

function initGame() {
    NAF.connection.subscribeToDataChannel("finish", () => {
        finish();
    });
    checkVictoryInterval = setInterval(checkVictory, 5000);
    if (currentRole == ROLE_LIBRARIAN) {
        //set camera to overhead and disable movement
        $("#rig").removeAttr("movement-controls");
        $("#playerCamera").removeAttr("look-controls");
        $("#playerCamera").attr("position", "-5 30 5");
        $("#playerCamera").attr("rotation", "-90 0 0");
        //bright lighting
        $("#sceneLight").attr("light", "color: #ffffff; intensity: 2");
        //remove flashlight
        $("#flashlight").remove();
        //remove hands
        $("#leftHand").remove();
        $("#rightHand").remove();
        $("#mazeMap").attr("visible", "true");
        $("#mazeObject").remove();
        //enlarge scale of networked objects
    } else if (currentRole == ROLE_EXPLORER) {
        var audio = new Audio("/sounds/Desolation.mp3");
        audio.loop = true;
        audio.play();
        //hide the networked object
        $(".avatar").attr("visible", "false");
    }
}

function syncRole (senderId, dataType, data, targetId) {
    console.log("Received role");
    if (currentState == STATE_WAITING) {
        setState(STATE_ROLE_SELECT);
    }
    if (data == 0) {
        deselectRole(otherRole);
        setRoleDisabled(otherRole, false);
        otherRole = data;
    } else if (data != currentRole) {
        otherRole = data;
        selectRole(otherRole);
        setRoleDisabled(otherRole, true);
    }
}

function setRoleDisabled(role, disabled) {
    if (ROLEBUTTONS[role] != null) {
        $(ROLEBUTTONS[role]).prop("disabled", disabled);
        $(ROLEBUTTONS[role]).removeClass('activated-button');
    }
}

function deselectRole(role) {
    if (ROLEBUTTONS[role] != null) {
        $(ROLEBUTTONS[role]).removeClass('activated-button');
        $(ROLESPANS[role]).html("0/1");
    }
}

function selectRole(role) {
    if (ROLEBUTTONS[role] != null) {
        $(ROLEBUTTONS[role]).addClass('activated-button');
        $(ROLESPANS[role]).html("1/1");
    }
}

function setEntityY(entitySelector, y) {
    var entity = document.querySelector(entitySelector);
    var entityPos = entity.getAttribute("position");
    entity.setAttribute("position", entityPos.x + " " + y + " " + entityPos.z);
}

function setPlayerHeight(y) {
    setEntityY("#playerCamera", y);
    setEntityY("#leftHand", y);
    setEntityY("#rightHand", y);
}

$(() => {
    // Start Logic
    let startPressed = false;
    let $startButton = $('#start-button');
    let $warningDiv = $('#warning-alert-div');
    let $startingDiv = $('#starting-alert-div');
    let $countdownSpan = $('#countdown-span');
    let $lobbyStatus = $('#lobby-status');
    let $lobbyCount = $('#lobby-count');

    document.addEventListener('keydown', function (evt) {
        if (evt.key == '1') {
            setPlayerHeight(1.6);
        } else if (evt.key == '2') {
            setPlayerHeight(0);
        } else if (evt.key == '3') {
            setPlayerHeight(-0.45);
        }
    });

    document.body.addEventListener('clientConnected', function (evt) {
        console.error('clientConnected event. clientId =', evt.detail.clientId);
        setState(STATE_ROLE_SELECT);
        $lobbyCount.html('2');
        NAF.connection.broadcastData("role", currentRole);
        NAF.connection.broadcastData("ready", ready);
    });

    document.body.addEventListener('clientDisconnected', function (evt) {
        console.error('clientDisconnected event. clientId =', evt.detail.clientId);
        setState(STATE_WAITING);
        $lobbyCount.html('1');
        otherRole = 0;
        otherReady = false;
    });

    $startButton.on('click', () => {
        startTime = new Date().getTime();
        ready = true;
        setRoleDisabled(ROLE_EXPLORER, true);
        setRoleDisabled(ROLE_LIBRARIAN, true);
        $startButton.prop("disabled", true);
        if (otherReady) {
            start();
        }
        NAF.connection.broadcastData("ready", true);
    });

    // Switching roles logic
    let $libBtn = $('#btn-lib');
    let $runBtn = $('#btn-run');
    let $selectedRole = $('#selected-role');
    let $libBtnSpan = $('#lib-btn-span');
    let $runBtnSpan = $('#run-btn-span');

    $libBtn.on('click', () => {
        if (otherRole == ROLE_LIBRARIAN) {
            return;
        }
        deselectRole(currentRole);
        if (currentRole == ROLE_LIBRARIAN) {
            currentRole = ROLE_NONE;
            $startButton.prop("disabled", true);
        } else {
            currentRole = ROLE_LIBRARIAN;
            selectRole(currentRole);
            $startButton.prop("disabled", false);
        }
        $selectedRole.text(ROLETEXT[currentRole]);
        NAF.connection.broadcastData("role", currentRole);
    });

    $runBtn.on('click', () => {
        if (otherRole == ROLE_EXPLORER) {
            return;
        }
        deselectRole(currentRole);
        if (currentRole == ROLE_EXPLORER) {
            currentRole = ROLE_NONE;
            $startButton.prop("disabled", true);
        } else {
            currentRole = ROLE_EXPLORER;
            selectRole(currentRole);
            $startButton.prop("disabled", false);
        }
        $selectedRole.text(ROLETEXT[currentRole]);
        NAF.connection.broadcastData("role", currentRole);
    });

    function fillRoles() {
        $libBtn.addClass('activated-button');
        $runBtn.addClass('activated-button');
        $libBtnSpan.html('1/1');
        $runBtnSpan.html('1/1');
        $runBtn.attr('disabled', 'disabled');
        $libBtn.attr('disabled', 'disabled');
    }
});