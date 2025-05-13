// 3D Model Viewer for Respiratory System
document.addEventListener('DOMContentLoaded', function() {
    // Check if WebGL is supported
    if (!Detector.webgl) {
        const container = document.getElementById('3d-model-container');
        container.innerHTML = `
            <div class="webgl-error">
                <p>Your browser does not support WebGL. For the best experience, please use a modern browser like Chrome, Firefox, or Edge.</p>
                <p>You can still explore the 2D diagram below.</p>
            </div>
        `;
        return;
    }

    // Initialize Three.js scene
    const container = document.getElementById('3d-model-container');
    const canvas = document.getElementById('respiratory-3d-model');
    const loadingIndicator = document.getElementById('loading-model');
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe9ecef);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Controls
    const controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    
    // Model variables
    let respiratoryModel;
    let currentModel = 'full';
    let autoRotate = false;
    
    // Model parts information
    const modelParts = {
        nose: {
            name: "Nose",
            description: "The primary entrance for air into the respiratory system. Filters and warms incoming air."
        },
        mouth: {
            name: "Mouth",
            description: "Secondary entrance for air. Can be used when nasal passages are blocked."
        },
        pharynx: {
            name: "Pharynx",
            description: "Common passageway for air and food. Connects nasal cavity and mouth to larynx and esophagus."
        },
        larynx: {
            name: "Larynx",
            description: "Contains vocal cords and prevents food from entering the lower respiratory tract."
        },
        trachea: {
            name: "Trachea",
            description: "Windpipe that carries air to the bronchi. Reinforced with C-shaped cartilage rings."
        },
        bronchi: {
            name: "Bronchi",
            description: "Two main branches of the trachea that lead to the lungs."
        },
        lungs: {
            name: "Lungs",
            description: "Paired organs where gas exchange occurs. Right lung has 3 lobes, left has 2."
        },
        alveoli: {
            name: "Alveoli",
            description: "Tiny air sacs where oxygen and carbon dioxide are exchanged with blood."
        },
        diaphragm: {
            name: "Diaphragm",
            description: "Dome-shaped muscle that drives the breathing process through contraction and relaxation."
        }
    };
    
    // Raycaster for model interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Load models
    function loadModel(type) {
        // In a real implementation, you would load actual 3D models here
        // For this example, we'll create simple geometric representations
        
        // Remove existing model if present
        if (respiratoryModel) {
            scene.remove(respiratoryModel);
        }
        
        // Create a new group for the model
        respiratoryModel = new THREE.Group();
        
        // Create different representations based on the type
        if (type === 'full') {
            createFullSystem();
            updateModelInfo("Respiratory System Overview", "This model shows the complete human respiratory system from nose to lungs.");
        } else if (type === 'upper') {
            createUpperRespiratory();
            updateModelInfo("Upper Respiratory System", "This model shows the upper respiratory tract including nose, mouth, pharynx, and larynx.");
        } else if (type === 'lungs') {
            createLungs();
            updateModelInfo("Lungs and Alveoli", "This model shows the lungs, bronchi, and alveoli where gas exchange occurs.");
        }
        
        scene.add(respiratoryModel);
        loadingIndicator.style.display = 'none';
    }
    
    // Create simplified full system model
    function createFullSystem() {
        // These are simplified representations - in a real app you'd use detailed 3D models
        
        // Nose
        const nose = new THREE.Mesh(
            new THREE.ConeGeometry(0.3, 1, 8),
            new THREE.MeshPhongMaterial({ color: 0xff9999 })
        );
        nose.position.set(0, 2, 0);
        nose.rotation.x = Math.PI / 2;
        nose.userData = { part: 'nose' };
        respiratoryModel.add(nose);
        
        // Mouth
        const mouth = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.2, 0.3),
            new THREE.MeshPhongMaterial({ color: 0xff6666 })
        );
        mouth.position.set(0, 1.8, 0.3);
        mouth.userData = { part: 'mouth' };
        respiratoryModel.add(mouth);
        
        // Trachea
        const trachea = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 3, 8),
            new THREE.MeshPhongMaterial({ color: 0x99ccff })
        );
        trachea.position.set(0, 0, 0);
        trachea.userData = { part: 'trachea' };
        respiratoryModel.add(trachea);
        
        // Lungs
        const leftLung = new THREE.Mesh(
            new THREE.SphereGeometry(0.8, 16, 16),
            new THREE.MeshPhongMaterial({ color: 0x66a3ff, transparent: true, opacity: 0.8 })
        );
        leftLung.position.set(-0.8, -0.5, 0);
        leftLung.scale.set(1, 1.3, 1.5);
        leftLung.userData = { part: 'lungs' };
        respiratoryModel.add(leftLung);
        
        const rightLung = new THREE.Mesh(
            new THREE.SphereGeometry(0.9, 16, 16),
            new THREE.MeshPhongMaterial({ color: 0x66a3ff, transparent: true, opacity: 0.8 })
        );
        rightLung.position.set(0.9, -0.5, 0);
        rightLung.scale.set(1, 1.4, 1.6);
        rightLung.userData = { part: 'lungs' };
        respiratoryModel.add(rightLung);
        
        // Diaphragm
        const diaphragm = new THREE.Mesh(
            new THREE.CircleGeometry(1.5, 32),
            new THREE.MeshPhongMaterial({ color: 0xccffcc, side: THREE.DoubleSide })
        );
        diaphragm.position.set(0, -1.8, 0);
        diaphragm.rotation.x = Math.PI / 2;
        diaphragm.userData = { part: 'diaphragm' };
        respiratoryModel.add(diaphragm);
    }
    
    function createUpperRespiratory() {
        // Similar simplified representations for upper respiratory system
        // Implementation would be similar to createFullSystem() but focused on upper parts
    }
    
    function createLungs() {
        // Similar simplified representations for lungs and alveoli
        // Implementation would be similar to createFullSystem() but focused on lungs
    }
    
    // Update model information display
    function updateModelInfo(title, description) {
        document.getElementById('model-title').textContent = title;
        document.getElementById('model-description').textContent = description;
        document.getElementById('selected-part').textContent = 'None';
        document.getElementById('part-details').textContent = 'Click on any part of the model to learn more about it.';
    }
    
    // Handle model part selection
    function onModelClick(event) {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;
        
        // Update the raycaster
        raycaster.setFromCamera(mouse, camera);
        
        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(scene.children, true);
        
        if (intersects.length > 0) {
            const part = intersects[0].object.userData.part;
            if (part && modelParts[part]) {
                document.getElementById('selected-part').textContent = modelParts[part].name;
                document.getElementById('part-details').textContent = modelParts[part].description;
                
                // Highlight the selected part (simple version - would be more complex with real models)
                intersects[0].object.material.color.setHex(0xff0000);
                setTimeout(() => {
                    // Reset color after 1 second
                    if (part === 'nose') intersects[0].object.material.color.setHex(0xff9999);
                    else if (part === 'mouth') intersects[0].object.material.color.setHex(0xff6666);
                    else if (part === 'trachea') intersects[0].object.material.color.setHex(0x99ccff);
                    else if (part === 'lungs') intersects[0].object.material.color.setHex(0x66a3ff);
                    else if (part === 'diaphragm') intersects[0].object.material.color.setHex(0xccffcc);
                }, 1000);
            }
        }
    }
    
    // Event listeners for model controls
    document.getElementById('viewFullSystem').addEventListener('click', () => {
        currentModel = 'full';
        loadingIndicator.style.display = 'flex';
        setTimeout(() => loadModel('full'), 500);
    });
    
    document.getElementById('viewUpperRespiratory').addEventListener('click', () => {
        currentModel = 'upper';
        loadingIndicator.style.display = 'flex';
        setTimeout(() => loadModel('upper'), 500);
    });
    
    document.getElementById('viewLungs').addEventListener('click', () => {
        currentModel = 'lungs';
        loadingIndicator.style.display = 'flex';
        setTimeout(() => loadModel('lungs'), 500);
    });
    
    document.getElementById('rotateModel').addEventListener('click', function() {
        autoRotate = !autoRotate;
        this.textContent = autoRotate ? 'Stop Rotation' : 'Auto-Rotate';
    });
    
    document.getElementById('resetView').addEventListener('click', () => {
        controls.reset();
        camera.position.z = 5;
    });
    
    // Handle canvas click
    canvas.addEventListener('click', onModelClick, false);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        if (autoRotate) {
            respiratoryModel.rotation.y += 0.005;
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Initial load
    loadModel('full');
    animate();
});