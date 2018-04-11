const WARNING_INCOMPATIBLE_BROWSER = "The browser you are using is not supported at the moment and may not work with the application. \n We recommend using the latest version of Mozilla FireFox.";
const ERROR_ROOM_FULL = "The room you are trying to connect to is full.";
const ERROR_FAILED_TO_CONNECT = "Failed to connect to room";

function displayErrorModal(message, title, callback) {
    $("#errorModalMessage").text(message);
    if (title) {
        $("#errorModalTitle").text(message);
    }
    $("#errorModal").modal("show");
    if (callback) {
        $("#errorModal").on('hidden.bs.modal', function() {
            callback();
            $("#errorModal").unbind('hidden.bs.modal');
        });
    }
}