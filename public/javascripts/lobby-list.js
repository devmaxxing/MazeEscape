$(() => {
    connect();
    // Refresh button stuff
    let $refreshButton = $('#refresh-button');
    let refreshClicked = false;
    let $successAlert = $('#successful-alert');

    $refreshButton.on('click', () => {
        setUpdating();
        setTimeout(() => {
            $successAlert.slideToggle();
            loadRooms();
            setTimeout(() => {
                $successAlert.slideToggle();
            }, 2000);
            setDefault();
        }, 2000);
    });

    function connect() {
        easyrtc.enableAudio(false);
        easyrtc.enableVideo(false);
        easyrtc.connect(
            "maze_escape", 
            loadRooms, 
            function(errorText) {
                console.log("failed to connect ", errorText);
            });
    }

    function loadRooms(easyrtcid = "", roomOwner = "") {
        // Clean rooms
        $('#roomTable tr').remove();
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
        joinButton.classList.add("btn");
        joinButton.classList.add("btn-small");
        joinButton.classList.add("btn-success");
        joinButton.onclick = function () {
            location.href = "/lobby?room=" + roomName;
        };
        buttonData.appendChild(joinButton);
        roomRow.appendChild(nameData);
        roomRow.appendChild(clientData);
        roomRow.appendChild(buttonData);
        document.getElementById("roomTable").appendChild(roomRow);
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