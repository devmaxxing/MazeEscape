$(() => {
    let $formbtn = $('#form-submit-btn');
    let $form = $('#create-room-form');
    let $roomName = $('#room-name');
    let $selectedMap = $('#selected-map');
    let $mapDetails = $('#map-details');
    let $alertDiv = $('#unsuccessful-alert-div');
    let $alert = $('#unsuccessful-alert');
    let alertVisible = false;

    $formbtn.on('click', () => {
        let errString = "";
        if (!$roomName.val()) {
            errString = appendToErrString(errString,"Please enter a valid Room Name");
        } else if ($roomName.val().length < 3) {
            errString = appendToErrString(errString,"Room Name must be at least 3 characters long");
        }

        if ($selectedMap.val() == "default") {
            errString = appendToErrString(errString,"Please select a Map");
        }

        if ($roomName.val()) {
            $.ajax({
                url: '/lobby/model/'+$roomName.val(),
                type: 'GET',
                success: (data) => {
                    if (data) {
                        errString = appendToErrString(errString, "Room name already exists");
                        if (errString) {
                            if (!alertVisible) {
                                $alertDiv.slideToggle();
                                alertVisible = true;
                            }
                            $alert.html(errString);
                        }
                    } else if(!errString) {
                        $form.submit();
                    } else {
                        if (!alertVisible) {
                            $alertDiv.slideToggle();
                            alertVisible = true;
                        }
                        $alert.html(errString);
                    }
                }
            });
        } else {
            if (!alertVisible) {
                $alertDiv.slideToggle();
                alertVisible = true;
            }
            $alert.html(errString);
        }
    });

    function appendToErrString(errString,err) {
        if (errString) {
            errString += '<br>- '+err;
        } else {
            errString = "- "+err;
        }
        return errString;
    }

    let mapDetails = {
        maze_1: 'Librarian (1) / Runner (1)'
    };

    $selectedMap.on('change', () => {
        $mapDetails.html(mapDetails[$selectedMap.val()]);
    });
});