var isFirefox = typeof InstallTrigger !== 'undefined';
if (!isFirefox) {
    displayErrorModal(WARNING_INCOMPATIBLE_BROWSER, "WARNING");
}