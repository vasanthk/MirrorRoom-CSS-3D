var animate3d = animate3d || {
        screen: {
            elem: null,
            callback: null,
            width: 0,
            height: 0,
            left: 0,
            top: 0,
            init: function (id, callback, initRes) {
                this.elem = document.getElementById(id);
                this.callback = callback || null;
                window.addEventListener('resize', function () {
                    animate3d.screen.resize();
                }, false);
                initRes && this.resize();
            },
            resize: function () {
                var elem = this.elem;
                this.width = elem.offsetWidth;
                this.height = elem.offsetHeight;
                for (this.left = 0, this.top = 0; elem != null; elem = elem.offsetParent) {
                    this.left += elem.offsetLeft;
                    this.top += elem.offsetTop;
                }
                this.callback && this.callback();
            }
        },
        drag: {
            screen: null,
            x: 0,
            y: 0,
            xs: 0,
            ys: 0,
            bx: 0,
            by: 0,
            xp: 0,
            yp: 0,
            active: false,
            down: function (e, touch) {
                e.preventDefault();
                var pointer = touch ? e.touches[0] : e;
                (!touch && document.setCapture) && document.setCapture();
                this.xp = this.xs = pointer.clientX;
                this.yp = this.ys = pointer.clientY;
                this.active = true;
            },
            up: function (e, touch) {
                e.preventDefault();
                (!touch && document.releaseCapture) && document.releaseCapture();
                this.bx = this.x;
                this.by = this.y;
                this.active = false;
            },
            move: function (e, touch) {
                e.preventDefault();
                if (this.active) {
                    var pointer = touch ? e.touches[0] : e;
                    this.xp = pointer.clientX;
                    this.yp = pointer.clientY;
                    this.x = this.bx - (this.xp - this.xs);
                    this.y = this.by - (this.yp - this.ys);
                }
            },
            init: function (screen) {
                var self = this;
                this.screen = screen.elem;
                if ('ontouchstart' in window) {
                    // Touch events
                    this.screen.ontouchstart = function (e) {
                        self.down(e, true);
                    };
                    this.screen.ontouchmove = function (e) {
                        self.move(e, true);
                    };
                    this.screen.ontouchend = function (e) {
                        self.up(e, true);
                    };
                    this.screen.ontouchcancel = function (e) {
                        self.up(e, true);
                    };
                }
                // Mouse events
                document.addEventListener("mousedown", function (e) {
                    self.down(e, false);
                }, true);
                document.addEventListener("mousemove", function (e) {
                    self.move(e, false);
                }, true);
                document.addEventListener("mouseup", function (e) {
                    self.up(e, false);
                }, true);
            }
        },
        Ease: function (speed, val) {
            this.speed = speed;
            this.value = val;
        }
    };

animate3d.Ease.prototype.ease = function (target) {
    this.value += (target - this.value) * this.speed;
};