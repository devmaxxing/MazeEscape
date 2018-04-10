AFRAME.registerComponent('exit', {
    init: function() {
        this.bounds = new THREE.Box3();
        var geometry = this.el.getAttribute('geometry');
        var position = this.el.object3D.getWorldPosition();
        this.bounds.setFromCenterAndSize(   new THREE.Vector3(position.x, position.y, position.z), 
                                            new THREE.Vector3(geometry.width, geometry.height, geometry.depth));        
        this.player = document.querySelector("#playerCamera").object3D;
        this.gameOver = false;
    },
    tick: function () {
        if (!this.gameOver && this.bounds.containsPoint(this.player.getWorldPosition())) {
            var timeInMinutes = Math.round((new Date().getTime() - startTime)/60000);
            console.log(timeInMinutes);
            NAF.connection.broadcastData("finish", timeInMinutes);
            finish(timeInMinutes);
            this.gameOver = true;
        }
    }
});