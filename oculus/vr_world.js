/*
 * ∆
 */
function VrWorld() {

    // constants
    this.light_origin = 300;
    this.num_cubes = 1000;
    this.light_distance = 0;

    // vr variables
    this.vr_effect = null;
    this.scene = null;
    this.camera = null;

    // scene variables
    this.raycaster = null;
    this.cubes =null;

    this.spot_light_depth = 75;
    this.spot_light_position = [this.spot_light_depth, this.spot_light_depth, this.spot_light_depth];


    this.init = function (scene, vr_effect, camera) {
        /* init variables and hook into vr */
        this.scene = scene;
        this.vr_effect = vr_effect;
        this.camera = camera;

        /* populate scene */
        this.populate_scene();

        /* init controls */
        this.init_controls();
    },

        this.rLocation = function(x) {
            return Math.random() * x - x/2.0;
        }

    this.init_lights = function() {

        this.red_light = new THREE.PointLight( 0xff0000, 1, this.light_distance);
        this.red_light.position.set(this.light_origin, this.light_origin, this.light_origin);

        this.white_light = new THREE.PointLight(0xffffff, 1, this.light_distance );
        this.white_light.position.set(this.light_origin, this.light_origin, this.light_origin);

        this.spotLight = new THREE.SpotLight( 0xffffff, 1, 0);
        this.spotLight.position.set(
            this.spot_light_position[0],
            this.spot_light_position[1],
            this.spot_light_position[2]
        );

        this.spotLight.castShadow = true;

        this.spotLight.shadowMapWidth = 1024;
        this.spotLight.shadowMapHeight = 1024;

        this.spotLight.shadowCameraNear = 500;
        this.spotLight.shadowCameraFar = 4000;
        this.spotLight.shadowCameraFov = 30;

        this.scene.add( this.spotLight );
    };

    this.add_light = function(which) {
//        this.scene.remove(this.basic_light);
        this.scene.remove(this.red_light);
        this.scene.remove(this.white_light);
        if (which=="red") {
            this.scene.add(this.red_light);
        }
        if (which=="white") {
            this.scene.add(this.white_light);
        }
        if (which=="spot") {
            this.scene.add(this.spotLight);
        }
    };

    this.populate_scene = function() {

        this.init_lights();
        this.add_light("spot");

        var geometry = new THREE.BoxGeometry(20, 20, 20);

        this.cubes = [];
        for (var i = 0; i < this.num_cubes; i++) {

            var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }));

            object.position.x = Math.random() * 800 - 400;
            object.position.y = Math.random() * 800 - 400;
            object.position.z = Math.random() * 800 - 400;

            object.rotation.x = Math.random() * 2 * Math.PI;
            object.rotation.y = Math.random() * 2 * Math.PI;
            object.rotation.z = Math.random() * 2 * Math.PI;

            object.scale.x = Math.random() + 0.5;
            object.scale.y = Math.random() + 0.5;
            object.scale.z = Math.random() + 0.5;

            object.speed = [(Math.random() - 0.5) * (Math.random() - 0.5),
                    (Math.random() - 0.5) * (Math.random() - 0.5),
                    (Math.random() - 0.5) * (Math.random() - 0.5)];

            this.cubes.push(object);

            this.scene.add(object);

        }

        this.raycaster = new THREE.Raycaster();
    },

        this.init_controls = function() {

            /* add event listeners */
            document.addEventListener('mousemove', this.onDocumentMouseMove, false);
        },

        this.onDocumentMouseMove = function (event) {

            event.preventDefault();

            vr_mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            vr_mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;

        },

        this.animate = function () {

            // always start animation loop by doing this
            vr_controls.update();


            for (var i = 0; i < this.cubes.length; i++) {
                var cube = this.cubes[i];
                cube.position.x += cube.speed[0];
                cube.position.y += cube.speed[1];
                cube.position.z += cube.speed[2];
            }

            var self = this;
            requestAnimationFrame(function(){self.animate()});

            this.render(this.vr_effect, this.camera);
        },

        this.render = function () {

            this.camera.updateMatrixWorld();
            this.vr_effect.render(this.scene, this.camera);

        }
};