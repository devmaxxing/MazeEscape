$(() => {
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