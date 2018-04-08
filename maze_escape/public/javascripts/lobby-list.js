$(() => {
    connect();
    // Refresh button stuff
    let $refreshButton = $('#refresh-button');
    let refreshClicked = false;

    $refreshButton.on('click', () => {
        setUpdating();
        setTimeout(() => {
            if (!refreshClicked) {
                updateListGood();
                refreshClicked = true;
            } else {
                updateListBad();
            }
        }, 1000);
    });

    function connect() {
        easyrtc.connect(
            "maze_escape", 
            loadRooms, 
            function(errorText) {
                console.log("failed to connect ", errorText);
            });
    }

    function loadRooms(easyrtcid, roomOwner) {
        easyrtc.getRoomList(
            function(roomList){
                for (roomName in roomList) {
                    if (!(roomName === "default" || roomList[roomName]["numberClients"] > 1)){
                        addRoom(roomName, roomList[roomName]["numberClients"]);
                    }
                }
            },
            function(errorCode, errorText) {
                easyrtc.showError(errorCode, errorText);
            }
        )
    }

    function addRoom(roomName, numberClients) {
        var roomRow = document.createElement("tr");
        var nameData = document.createElement("td");
        nameData.appendChild(document.createTextNode(roomName));
        var clientData = document.createElement("td");
        clientData.appendChild(document.createTextNode(numberClients + "/2"));
        var buttonData = document.createElement("td");
        var joinButton = document.createElement("button");
        joinButton.appendChild(document.createTextNode("JOIN"));
        joinButton.onclick = function () {
            location.href = "/lobby?room=" + roomName;
        };
        buttonData.appendChild(joinButton);
        roomRow.appendChild(nameData);
        roomRow.appendChild(clientData);
        roomRow.appendChild(buttonData);

        document.getElementById("roomTable").appendChild(roomRow);
    }

    function updateListGood() {
        let $buttonToUpdate = $('#update-on-refresh-button');
        $buttonToUpdate.html("Escaper (1/1)");
        $buttonToUpdate.removeClass('btn-success');
        $buttonToUpdate.addClass('btn-danger');
        $buttonToUpdate.attr('disabled', 'disabled');

        let $rowToUpdate = $('#update-on-refresh-row');
        $rowToUpdate.addClass('table-danger');
        $('#hidden-lobby').show();
        let $successAlert = $('#successful-alert');
        $successAlert.slideToggle();
        setTimeout(() => {
            setDefault();
            $successAlert.slideToggle();
        }, 3000);
    }

    function updateListBad() {
        let $unsuccessAlert = $('#unsuccessful-alert');
        $unsuccessAlert.slideToggle();
        setTimeout(() => {
            setDefault();
            $unsuccessAlert.slideToggle();
        }, 3000);
    }

    function setUpdating() {
        $refreshButton.html('Refreshing...');
        $refreshButton.attr('disabled', 'disabled');
    }

    function setDefault() {
        $refreshButton.html('Refresh List');
        $refreshButton.removeAttr('disabled');
    }

});