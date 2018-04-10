AFRAME.registerComponent('npc', {
    schema: {
        destination1:{type:'string', default:'0 0 0'},
        destination2:{type:'string', default:'0 0 0'}
    },
    init: function() {
        this.bounds;
        var d1 = this.data.destination1.split();
        var d2 = this.data.destination2.split();
        this.player = document.querySelector("#playerCamera").object3D;
        this.chasingPlayer = false;
        this.destination1 = new Three.Vector3(d1[0], d1[1], d1[2]);
        this.destination2 = new Three.Vector3(d2[0], d2[1], d2[2]);
        this.el.setAttribute("nav-agent", "destination:" + this.data.destination1);
    },
    tick: function() {
        if (this.chasingPlayer) {
            if (!this.playerNearby()) {
                this.chasingPlayer = false;
                
            }
        } else {
            if (playerNearby()) {

            }
            var navData = this.el.getAttribute("nav-agent");
            if (this.el.getAttribute("nav-agent")) {

            }
        }
    },
    playerNearby: function() {
        return this.player.getWorldPosition().distanceFrom(this.el.object3D.getWorldPosition()) <= 5;
    },
    setDestination: function(newDest) {
        this.destination = newDest;
        this.el.setAttribute("nav-agent","");
    }
  });