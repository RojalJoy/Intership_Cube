import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './components/cube.css'
const Cube = () => {
    const mainViewRef = useRef();
    const topViewRef = useRef();
    const [a, setA] = useState(5);
    const [b, setB] = useState(1);
    const cubesRef = useRef([]);
    const equationRef = useRef();

    useEffect(() => {
        let scene, camera, renderer, topViewRenderer, topViewCamera, controls;

        const init = () => {
            // Main 3D view setup
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

            renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
            mainViewRef.current.appendChild(renderer.domElement);

            // OrbitControls for user interaction
            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.screenSpacePanning = false;
            controls.maxPolarAngle = Math.PI / 2;

            // Top-down view setup
            topViewRenderer = new THREE.WebGLRenderer({ antialias: true });
            topViewRenderer.setSize(200, 200);
            topViewRef.current.appendChild(topViewRenderer.domElement);
            topViewCamera = new THREE.OrthographicCamera(0, 10, 0, -10, 1, 100);
            topViewCamera.position.set(0, 20, 0);
            topViewCamera.lookAt(0, 0, 0);

            // Axes setup
            const axesHelper = new THREE.AxesHelper(15);
            scene.add(axesHelper);
            addUnitMarkings(scene);

            createCubes(scene);
            updateEquation();
            camera.position.set(20, 20, 20);
            camera.lookAt(0, 0, 0);

            const animate = () => {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
                topViewRenderer.render(scene, topViewCamera);
            };
            animate();
        };

        const addUnitMarkings = (scene) => {
            const material = new THREE.LineBasicMaterial({ color: 0xffffff });
            const unitLength = 1;

            for (let i = 0; i <= 10; i++) {
                const pointsX = [new THREE.Vector3(i * unitLength, 0, 0), new THREE.Vector3(i * unitLength, 0.2, 0)];
                const geometryX = new THREE.BufferGeometry().setFromPoints(pointsX);
                const lineX = new THREE.Line(geometryX, material);
                scene.add(lineX);

                const pointsY = [new THREE.Vector3(0, i * unitLength, 0), new THREE.Vector3(0.2, i * unitLength, 0)];
                const geometryY = new THREE.BufferGeometry().setFromPoints(pointsY);
                const lineY = new THREE.Line(geometryY, material);
                scene.add(lineY);

                const pointsZ = [new THREE.Vector3(0, 0, i * unitLength), new THREE.Vector3(0.2, 0, i * unitLength)];
                const geometryZ = new THREE.BufferGeometry().setFromPoints(pointsZ);
                const lineZ = new THREE.Line(geometryZ, material);
                scene.add(lineZ);
            }
        };

        const createCubes = (scene) => {
            const materials = [
                new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 }), // red (a^3)
                new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 }), // green (b^3)
                new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.5 }), // blue (3a^2b)
                new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.5 }), // yellow (3a^2b)
                new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 }), // cyan (3a^2b)
                new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.5 }), // magenta (3ab^2)
                new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }), // white (3ab^2)
                new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0.5 })  // orange (3ab^2)
            ];

            const positions = [
                { w: a, h: a, d: a, x: a / 2, y: a / 2, z: a / 2 },
                { w: b, h: b, d: b, x: a + b / 2, y: a + b / 2, z: a + b / 2 },
                { w: a, h: a, d: b, x: a / 2, y: a / 2, z: a + b / 2 },
                { w: a, h: b, d: a, x: a / 2, y: a + b / 2, z: a / 2 },
                { w: b, h: a, d: a, x: a + b / 2, y: a / 2, z: a / 2 },
                { w: a, h: b, d: b, x: a / 2, y: a + b / 2, z: a + b / 2 },
                { w: b, h: a, d: b, x: a + b / 2, y: a / 2, z: a + b / 2 },
                { w: b, h: b, d: a, x: a + b / 2, y: a + b / 2, z: a / 2 }
            ];

            cubesRef.current = positions.map((pos, i) => createCube(scene, pos.w, pos.h, pos.d, pos.x, pos.y, pos.z, materials[i]));
        };

        const createCube = (scene, w, h, d, x, y, z, material) => {
            const geometry = new THREE.BoxGeometry(w, h, d);
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(x, y, z);
            scene.add(cube);
            return cube;
        };

        init();

        return () => {
            if (mainViewRef.current) mainViewRef.current.innerHTML = '';
            if (topViewRef.current) topViewRef.current.innerHTML = '';
        };
    }, []);

    const updateCubes = () => {
        const positions = [
            { w: a, h: a, d: a, x: a / 2, y: a / 2, z: a / 2 },
            { w: b, h: b, d: b, x: a + b / 2, y: a + b / 2, z: a + b / 2 },
            { w: a, h: a, d: b, x: a / 2, y: a / 2, z: a + b / 2 },
            { w: a, h: b, d: a, x: a / 2, y: a + b / 2, z: a / 2 },
            { w: b, h: a, d: a, x: a + b / 2, y: a / 2, z: a / 2 },
            { w: a, h: b, d: b, x: a / 2, y: a + b / 2, z: a + b / 2 },
            { w: b, h: a, d: b, x: a + b / 2, y: a / 2, z: a + b / 2 },
            { w: b, h: b, d: a, x: a + b / 2, y: a + b / 2, z: a / 2 }
        ];

        cubesRef.current.forEach((cube, i) => {
            cube.geometry.dispose(); // Dispose of the old geometry
            cube.geometry = new THREE.BoxGeometry(positions[i].w, positions[i].h, positions[i].d);
            cube.position.set(positions[i].x, positions[i].y, positions[i].z);
        });
    };

    const updateEquation = () => {
        const aCubed = a ** 3;
        const bCubed = b ** 3;
        const threeA2B = 3 * a ** 2 * b;
        const threeAB2 = 3 * a * b ** 2;
        const total = aCubed + bCubed + threeA2B + threeAB2;

        equationRef.current.innerHTML = `
                <b>(a+b)<sup>3</sup> = a<sup>3</sup> + 3a<sup>2</sup>b + 3ab<sup>2</sup> + b<sup>3</sup></b><br>
                <b>${a} + ${b} = ${a + b}</b><br>
                <b>(${a}+${b})<sup>3</sup> = ${total}</b><br><br>
                <b>a<sup>3</sup> = ${aCubed}</b><br>
                <b>b<sup>3</sup> = ${bCubed}</b><br>
                <b>3a<sup>2</sup>b = ${threeA2B}</b><br>
                <b>3ab<sup>2</sup> = ${threeAB2}</b>
            `;

        // Ensure MathJax is loaded before typesetting
        if (window.MathJax && window.MathJax.typeset) {
            window.MathJax.typeset();
        } else {
            console.error('MathJax is not loaded');
        }

        updateCubes();
    };

    const handleSliderChange = (event, setter) => {
        const value = parseInt(event.target.value, 10);
        setter(value);
    };

    useEffect(() => {
        updateEquation();
    }, [a, b]);

    return (
        <div>
            <h1>3D CUBE</h1>
            <div className='container'>
                <div className='bigcube' ref={mainViewRef}></div>
                <div className='slider_value_topview'>
                <div className='topview' ref={topViewRef}></div>
                    <div className='slider'> 
                        <label>
                        A =  {a}<br></br>
                        <input
                            type="range"
                            min="1"
                            max="10"                      
                            onChange={(event) => handleSliderChange(event, setA)}
                        />
                    </label>
                    <label>
                        <br></br><br></br>B = {b}<br></br>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            
                            onChange={(event) => handleSliderChange(event, setB)}
                        />
        
                    </label>
                    <div className='value' ref={equationRef}></div>
                
                    </div>
                
                </div>
            
                
                
            </div>
        </div>
    );
};

export default Cube;
