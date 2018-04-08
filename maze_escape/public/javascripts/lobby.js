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

function setState(state) {
    currentState = state;
    $("#lobby-status").text(STATUS_MESSAGES[currentState]);
}

function onConnect() {
    console.log("OnConnect");
    NAF.connection.subscribeToDataChannel("role", syncRole);
    NAF.connection.subscribeToDataChannel("ready", syncStart);
}

function syncStart (senderId, dataType, data, targetId) {
    otherReady = data;
    if (otherReady && ready) {
        start();
    }
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
                    //TODO set game objects properly
                    $("#game").removeAttr("hidden");
                }
    },1000);
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

$(() => {
    // Start Logic
    let startPressed = false;
    let $startButton = $('#start-button');
    let $warningDiv = $('#warning-alert-div');
    let $startingDiv = $('#starting-alert-div');
    let $countdownSpan = $('#countdown-span');
    let $lobbyStatus = $('#lobby-status');

    document.body.addEventListener('clientConnected', function (evt) {
        console.error('clientConnected event. clientId =', evt.detail.clientId);
        setState(STATE_ROLE_SELECT);
        NAF.connection.broadcastData("role", currentRole);
    });

    document.body.addEventListener('clientDisconnected', function (evt) {
        console.error('clientDisconnected event. clientId =', evt.detail.clientId);
        setState(STATE_WAITING);
        otherRole = 0;
    });

    $startButton.on('click', () => {
            // $warningDiv.slideToggle();
            // setTimeout(() => {
            //     $warningDiv.slideToggle();
            // }, 4000);
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