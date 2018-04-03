$(() => {
    // Start Logic
    let startPressed = false;
    let $startButton = $('#start-button');
    let $warningDiv = $('#warning-alert-div');
    let $startingDiv = $('#starting-alert-div');
    let $countdownSpan = $('#countdown-span');
    let $lobbyStatus = $('#lobby-status');
    
    $startButton.on('click', () => {
        if (!startPressed) {
            $warningDiv.slideToggle();
            setTimeout(() => {
                $warningDiv.slideToggle();
            }, 4000);
            startPressed = true;
        } else {
            $lobbyStatus = "Lobby Full";
            fillRoles();
            $startingDiv.slideToggle();
            let counter = 5;
            let interval = setInterval(() => {
                counter--;
                $countdownSpan.html(counter);
                if (counter == 0) {
                    clearInterval(interval);
                    location.href = "/test";
                }
            },1000);
            
        }
    });

    // Switching roles logic
    let $libBtn = $('#btn-lib');
    let $runBtn = $('#btn-run');
    let $selectedRole = $('#selected-role');
    let libSelected = true;
    let $libBtnSpan = $('#lib-btn-span');
    let $runBtnSpan = $('#run-btn-span');

    $libBtn.on('click', () => {
        if (libSelected) {
            return;
        }
        $selectedRole.html("Librarian");
        $libBtn.addClass('activated-button');
        $libBtn.attr('disabled', 'disabled');
        $libBtnSpan.html('1/1');
        $runBtn.removeClass('activated-button');
        $runBtn.removeAttr('disabled');
        $runBtnSpan.html('0/1');
        libSelected = true;
    });

    $runBtn.on('click', () => {
        if (!libSelected) {
            return;
        }
        $selectedRole.html("Runner");
        $runBtn.addClass('activated-button');
        $runBtn.attr('disabled', 'disabled');
        $runBtnSpan.html('1/1');
        $libBtn.removeClass('activated-button');
        $libBtn.removeAttr('disabled');
        $libBtnSpan.html('0/1');
        libSelected = false;
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