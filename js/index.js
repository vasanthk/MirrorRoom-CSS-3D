!function () {
    window.addEventListener('load', function () {
        "use strict";
        var Xi = 0, Yi = 0, Zi = 0, rotation;
        var faces, localTransform = [];
        var screen = ge1doot.screen;
        var drag = ge1doot.drag;
        var perp = new ge1doot.Ease(0.01, 50);
        // ==== init script ====
        screen.init("screen", function () {
        }, true);
        drag.init(screen);
        faces = document.getElementById("scene").getElementsByTagName("img");
        rotation = {
            ex: 0,
            ey: 0,
            x: 0,
            y: 0,
            tz: 0,
            tx: 0,
            ttx: 0,
            tty: 0,
            ttz: 0,
            speedx: 0.1,
            speedz: 0.1,
            ease: function (x, y) {
                this.y = -(this.ey += (x - this.ey) * 0.06) / 3;
                this.x = (this.ex += (y - this.ex) * 0.06) / 3;
                var a = this.y * Math.PI / 180;
                var x = -Math.sin(a) * this.speedx;
                var z = Math.cos(a) * this.speedz;
                this.tx += x;
                this.tz += z;
                if (drag.active) {
                    if ((this.tx > 260 && x > 0) || (this.tx < -260 && x < 0)) this.speedx *= 0.9;
                    else {
                        if (this.speedx < 0.1) this.speedx = 1;
                        if (this.speedx < 5) this.speedx *= 1.1;
                    }
                    if ((this.tz > 260 && z > 0) || (this.tz < -260 && z < 0)) this.speedz *= 0.9;
                    else {
                        if (this.speedz < 0.1) this.speedz = 1;
                        if (this.speedz < 5) this.speedz *= 1.1;
                    }
                } else {
                    this.speedx *= 0.9;
                    this.speedz *= 0.9;
                }
                a = Math.cos(this.x * Math.PI / 180);
                this.ttx = -(Math.cos((this.y - 90) * Math.PI / 180) * a) * 400;
                this.ttz = -(Math.sin((this.y - 90) * Math.PI / 180) * a) * 400;
                this.tty = Math.sin(this.x * Math.PI / 180) * 100;
            }
        }
        // ==== init faces ====
        for (var i = 0, n = faces.length; i < n; i++) {
            var elem = faces[i];
            var s = elem.getAttribute("data-transform");
            elem.style.transform = s;
            elem.style.webkitTransform = s;
            elem.style.visibility = "visible";
            localTransform.push(s);
        }
        // ==== main loop ====
        function run() {
            requestAnimationFrame(run);
            perp.ease(drag.active ? 300 : 500);
            if (drag.y > 270) drag.y = drag.by = 270;
            if (drag.y < -270) drag.y = drag.by = -270;
            rotation.ease(drag.x, drag.y);
            var globalRotation = "perspective(" + perp.value + "px) rotateX(" + rotation.x + "deg) " + "rotateY(" + rotation.y + "deg) translateX(" + (rotation.tx + rotation.ttx) + "px) translateY(" + rotation.tty + "px) translateZ(" + (rotation.tz + rotation.ttz) + "px)";
            // ==== anim faces ====
            for (var i = 0, n = faces.length; i < n; i++) {
                var elem = faces[i];
                var s = globalRotation + localTransform[i];
                elem.style.transform = s;
                elem.style.webkitTransform = s;
            }
        }

        // ==== start animation ====
        requestAnimationFrame(run);
    }, false);
}();