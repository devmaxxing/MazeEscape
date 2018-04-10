AFRAME.registerComponent('exit', {
    init: function() {
        this.bounds = new THREE.Box3();
        var geometry = this.el.getAttribute('geometry');
        var position = this.el.object3D.getWorldPosition();
        this.bounds.setFromCenterAndSize(   new THREE.Vector3(position.x, position.y, position.z), 
                                            new THREE.Vector3(geometry.width, geometry.height, geometry.depth));        
        this.player = document.querySelector("#playerCamera").object3D;
    },
    tick: function () {
        if (this.bounds.containsPoint(this.player.getWorldPosition())) {
            NAF.connection.broadcastData("finish", new Date().getTime());
            finish();
        }
    }
});