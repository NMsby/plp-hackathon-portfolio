// Three.js effects for Lina's Portfolio
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js effects
    initHeroBackground();
    initSkillsSphere();
    initTimeline3D();
});

// Enhanced Hero Background with DNA helix
function initHeroBackground() {
    const heroCanvas = document.getElementById('hero-canvas');

    if (!heroCanvas) return;

    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    // Set renderer size and add to DOM
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    heroCanvas.appendChild(renderer.domElement);

    // Set camera position
    camera.position.z = 35;

    // Create enhanced DNA helix
    const dnaHelix = createEnhancedDNAHelix();
    scene.add(dnaHelix);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add point lights for enhanced visual effect
    const pointLight1 = new THREE.PointLight(0x5ba6c9, 2, 100);
    pointLight1.position.set(20, -15, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x89d0e1, 2, 100);
    pointLight2.position.set(-20, 15, -20);
    scene.add(pointLight2);

    // Add particle background
    const particles = createParticleBackground();
    scene.add(particles);

    // Mouse interaction variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate DNA helix
        dnaHelix.rotation.y += 0.003;

        // Interactive rotation based on mouse position
        targetX = mouseX * 0.0003;
        targetY = mouseY * 0.0003;
        dnaHelix.rotation.y += 0.05 * (targetX - dnaHelix.rotation.y);
        dnaHelix.rotation.x += 0.05 * (targetY - dnaHelix.rotation.x);

        // Animate particles
        particles.rotation.y += 0.001;

        // Pulse effect for the DNA
        const time = performance.now() * 0.001;
        dnaHelix.children.forEach((child, index) => {
            if (child.material && child.material.opacity) {
                // Every other element pulses differently
                if (index % 4 === 0) {
                    child.material.opacity = 0.5 + Math.sin(time + index * 0.1) * 0.2;
                }
            }
        });

        renderer.render(scene, camera);
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Start animation
    animate();
}

// Create enhanced DNA helix
function createEnhancedDNAHelix() {
    const dnaGroup = new THREE.Group();
    const helixRadius = 10; // Increased radius
    const helixHeight = 60; // Increased height
    const nucleotidesCount = 30; // More nucleotides for detail

    // Materials with more vibrant colors and glow effect
    const strandMaterial1 = new THREE.MeshPhongMaterial({
        color: 0x2c6a8c,
        shininess: 100,
        transparent: true,
        opacity: 0.8,
        emissive: 0x1a3f53,
        emissiveIntensity: 0.5
    });

    const strandMaterial2 = new THREE.MeshPhongMaterial({
        color: 0x5ba6c9,
        shininess: 100,
        transparent: true,
        opacity: 0.8,
        emissive: 0x2d5364,
        emissiveIntensity: 0.5
    });

    const connectionMaterial = new THREE.MeshPhongMaterial({
        color: 0x89d0e1,
        shininess: 50,
        transparent: true,
        opacity: 0.7,
        emissive: 0x3d5e68,
        emissiveIntensity: 0.3
    });

    // Create more complex strands
    for (let i = 0; i < nucleotidesCount; i++) {
        const t = i / nucleotidesCount;
        const angle1 = t * Math.PI * 6; // More twists
        const angle2 = angle1 + Math.PI;

        const y = helixHeight * (t - 0.5);

        // Strand 1 position
        const x1 = helixRadius * Math.cos(angle1);
        const z1 = helixRadius * Math.sin(angle1);

        // Strand 2 position
        const x2 = helixRadius * Math.cos(angle2);
        const z2 = helixRadius * Math.sin(angle2);

        // Create spheres for each strand - larger with better geometry
        const sphereGeometry = new THREE.SphereGeometry(0.8, 24, 24);

        const sphere1 = new THREE.Mesh(sphereGeometry, strandMaterial1);
        sphere1.position.set(x1, y, z1);

        const sphere2 = new THREE.Mesh(sphereGeometry, strandMaterial2);
        sphere2.position.set(x2, y, z2);

        dnaGroup.add(sphere1);
        dnaGroup.add(sphere2);

        // Create connection between strands - every other node
        if (i % 2 === 0) {
            const connectionGeometry = new THREE.CylinderGeometry(0.3, 0.3, helixRadius * 2, 8);
            const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);

            // Position and rotate connection
            connection.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
            connection.lookAt(new THREE.Vector3(x2, y, z2));
            connection.rotateZ(Math.PI / 2);

            dnaGroup.add(connection);
        }
    }

    // Create the backbone (curved lines) with thicker tubes
    createStrandBackbone(dnaGroup, nucleotidesCount, helixRadius, helixHeight, true, strandMaterial1);
    createStrandBackbone(dnaGroup, nucleotidesCount, helixRadius, helixHeight, false, strandMaterial2);

    // Add glow effect via surrounding tubes
    createStrandGlow(dnaGroup, nucleotidesCount, helixRadius + 0.2, helixHeight, true, 0x2c6a8c);
    createStrandGlow(dnaGroup, nucleotidesCount, helixRadius + 0.2, helixHeight, false, 0x5ba6c9);

    return dnaGroup;
}

// Create strand backbone with thicker, more detailed tubes
function createStrandBackbone(group, count, radius, height, isFirst, material) {
    const points = [];
    const segmentsPerNucleotide = 15; // More segments for smoother curves

    for (let i = 0; i <= count * segmentsPerNucleotide; i++) {
        const t = i / (count * segmentsPerNucleotide);
        const angle = t * Math.PI * 6; // Match the twists from the nucleotides
        const angleOffset = isFirst ? 0 : Math.PI;

        const y = height * (t - 0.5);
        const x = radius * Math.cos(angle + angleOffset);
        const z = radius * Math.sin(angle + angleOffset);

        points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, count * segmentsPerNucleotide, 0.5, 12, false);
    const tube = new THREE.Mesh(geometry, material);

    group.add(tube);
}

// Create glow effect for strands
function createStrandGlow(group, count, radius, height, isFirst, color) {
    const points = [];
    const segmentsPerNucleotide = 15;

    for (let i = 0; i <= count * segmentsPerNucleotide; i++) {
        const t = i / (count * segmentsPerNucleotide);
        const angle = t * Math.PI * 6;
        const angleOffset = isFirst ? 0 : Math.PI;

        const y = height * (t - 0.5);
        const x = radius * Math.cos(angle + angleOffset);
        const z = radius * Math.sin(angle + angleOffset);

        points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, count * segmentsPerNucleotide, 1, 12, false);

    // Create glow material
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
    });

    const glowTube = new THREE.Mesh(geometry, glowMaterial);
    group.add(glowTube);
}

// Create particle background
function createParticleBackground() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 500; // Lots of particles
    const posArray = new Float32Array(particlesCnt * 3);

    for (let i = 0; i < particlesCnt * 3; i++) {
        // Position particles in a spherical volume
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Create star-like points with custom texture
    const particleTexture = createParticleTexture();

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.7,
        map: particleTexture,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        vertexColors: false
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    return particlesMesh;
}

// Create a custom texture for particles
function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;

    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
    );

    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(137,208,225,1)');
    gradient.addColorStop(0.4, 'rgba(91,166,201,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

// Enhanced Skills Sphere
function initSkillsSphere() {
    const skillsContainer = document.getElementById('skills-sphere');

    if (!skillsContainer) return;

    // Clear any existing content
    while (skillsContainer.firstChild) {
        skillsContainer.removeChild(skillsContainer.firstChild);
    }

    // Define skills with categories
    const skills = [
        // Medical category
        { name: "Laboratory Analysis", size: 1.8, category: "medical", color: 0x2c6a8c },
        { name: "Microbiology", size: 2.0, category: "medical", color: 0x2c6a8c },
        { name: "Quality Control", size: 1.7, category: "medical", color: 0x2c6a8c },
        { name: "Research", size: 1.9, category: "medical", color: 0x2c6a8c },
        { name: "PCR", size: 1.6, category: "medical", color: 0x2c6a8c },

        // Data Analysis category
        { name: "Excel", size: 1.8, category: "data", color: 0x5ba6c9 },
        { name: "Python", size: 1.7, category: "data", color: 0x5ba6c9 },
        { name: "SQL", size: 1.6, category: "data", color: 0x5ba6c9 },
        { name: "SPSS", size: 1.6, category: "data", color: 0x5ba6c9 },

        // Web Development category
        { name: "HTML", size: 1.7, category: "web", color: 0x89d0e1 },
        { name: "CSS", size: 1.7, category: "web", color: 0x89d0e1 },
        { name: "JavaScript", size: 1.5, category: "web", color: 0x89d0e1 }
    ];

    // Update container height for better visibility
    skillsContainer.style.height = '500px';

    // Create scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, skillsContainer.clientWidth / skillsContainer.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    // Set up renderer
    renderer.setSize(skillsContainer.clientWidth, skillsContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    skillsContainer.appendChild(renderer.domElement);

    // Set camera position
    camera.position.z = 25;

    // Create skill nodes
    const skillsGroup = new THREE.Group();

    // Add center sphere for visual interest
    const centerGeometry = new THREE.SphereGeometry(3, 32, 32);
    const centerMaterial = new THREE.MeshPhongMaterial({
        color: 0x183446,
        shininess: 100,
        transparent: true,
        opacity: 0.7
    });
    const centerSphere = new THREE.Mesh(centerGeometry, centerMaterial);
    skillsGroup.add(centerSphere);

    // Create particles around center
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 200;
    const posArray = new Float32Array(particlesCnt * 3);

    for(let i = 0; i < particlesCnt * 3; i++) {
        // Position particles in a sphere shape
        posArray[i] = (Math.random() - 0.5) * 25;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x5ba6c9,
        transparent: true,
        opacity: 0.7
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    skillsGroup.add(particlesMesh);

    // Create interactive skill labels
    skills.forEach((skill, index) => {
        // Create text sprite
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 256;

        // Draw text background with more opacity for visibility
        context.fillStyle = skill.category === 'medical' ? 'rgba(44, 106, 140, 0.9)' :
            skill.category === 'data' ? 'rgba(91, 166, 201, 0.9)' :
                'rgba(137, 208, 225, 0.9)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Add border
        context.strokeStyle = '#ffffff';
        context.lineWidth = 4;
        context.strokeRect(2, 2, canvas.width-4, canvas.height-4);

        // Draw text
        context.font = 'bold 48px Arial';
        context.fillStyle = '#ffffff';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(skill.name, canvas.width / 2, canvas.height / 2);

        // Create texture
        const texture = new THREE.CanvasTexture(canvas);

        // Create material
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });

        // Create sprite
        const sprite = new THREE.Sprite(material);

        // Position on sphere
        const phi = Math.acos(-1 + (2 * index) / skills.length);
        const theta = Math.sqrt(skills.length * Math.PI) * phi;

        const radius = 12; // Increased radius for better visibility
        sprite.position.x = radius * Math.sin(phi) * Math.cos(theta);
        sprite.position.y = radius * Math.sin(phi) * Math.sin(theta);
        sprite.position.z = radius * Math.cos(phi);

        // Size based on skill level - increased overall size
        sprite.scale.set(skill.size * 4, skill.size * 2, 1);

        // Create connecting line to center
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            sprite.position.clone()
        ]);

        const lineMaterial = new THREE.LineBasicMaterial({
            color: skill.color,
            transparent: true,
            opacity: 0.8,
            linewidth: 3
        });

        const line = new THREE.Line(lineGeometry, lineMaterial);

        // Create a node at the end of the line for visual interest
        const nodeGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const nodeMaterial = new THREE.MeshPhongMaterial({
            color: skill.color,
            shininess: 100
        });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(sprite.position);

        // Add to group
        skillsGroup.add(line);
        // skillsGroup.add(node); // Removed node sphere for visibility of skills
        skillsGroup.add(sprite);
    });

    scene.add(skillsGroup);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add point lights for visual interest
    const pointLight1 = new THREE.PointLight(0x5ba6c9, 1, 50);
    pointLight1.position.set(15, -10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x89d0e1, 1, 50);
    pointLight2.position.set(-15, 10, -10);
    scene.add(pointLight2);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Slowly rotate skills sphere
        skillsGroup.rotation.y += 0.003;

        // Interactive rotation based on mouse position
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        skillsGroup.rotation.y += 0.1 * (targetX - skillsGroup.rotation.y);
        skillsGroup.rotation.x += 0.1 * (targetY - skillsGroup.rotation.x);

        // Animate particles
        particlesMesh.rotation.y += 0.002;
        particlesMesh.rotation.x -= 0.001;

        renderer.render(scene, camera);
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = skillsContainer.clientWidth / skillsContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(skillsContainer.clientWidth, skillsContainer.clientHeight);
    });

    // Start animation
    animate();

    // Add click handler to toggle fullscreen for the skills container
    skillsContainer.addEventListener('click', function() {
        if (skillsContainer.requestFullscreen) {
            skillsContainer.requestFullscreen();
        } else if (skillsContainer.webkitRequestFullscreen) { /* Safari */
            skillsContainer.webkitRequestFullscreen();
        } else if (skillsContainer.msRequestFullscreen) { /* IE11 */
            skillsContainer.msRequestFullscreen();
        }
    });
}

// Enhanced 3D timeline
function initTimeline3D() {
    const timelineContainer = document.getElementById('timeline-container');

    if (!timelineContainer) return;

    // Clear any existing content
    while (timelineContainer.firstChild) {
        timelineContainer.removeChild(timelineContainer.firstChild);
    }

    // Increase container height for better visibility
    timelineContainer.style.height = '600px';

    // Timeline data
    const timelineData = [
        {
            period: "July 2022 - June 2023",
            title: "Research Assistant",
            organization: "HIV Mortality Surveillance at UCSF Global Program",
            description: "Coordinated laboratory activities and provided routine progress reports.",
            icon: "flask"
        },
        {
            period: "Nov 2020 - Jun 2021",
            title: "Lab Assistant",
            organization: "Mutindwa Diagnostic Laboratory",
            description: "Performed full blood analysis, stool analysis, and sputum testing.",
            icon: "microscope"
        },
        {
            period: "Mar - Sept 2020",
            title: "Laboratory Assistant",
            organization: "Premier Food Industries",
            description: "Analyzed and ensured quality of line products.",
            icon: "vial"
        },
        {
            period: "Apr - Dec 2019",
            title: "Laboratory Assistant",
            organization: "Kenya Medical Research Institute",
            description: "Processed laboratory samples with 99% accuracy.",
            icon: "dna"
        },
        {
            period: "2015 - 2019",
            title: "BSc. in Medical Microbiology",
            organization: "Jomo Kenyatta University",
            description: "Education",
            icon: "graduation-cap"
        }
    ];

    // Create scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, timelineContainer.clientWidth / timelineContainer.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    // Set up renderer
    renderer.setSize(timelineContainer.clientWidth, timelineContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    timelineContainer.appendChild(renderer.domElement);

    // Set camera position
    camera.position.z = 20;

    // Create timeline group
    const timelineGroup = new THREE.Group();

    // Create a more visually interesting timeline path
    const points = [];
    for (let i = 0; i <= 200; i++) {
        const t = i / 200;
        const x = (t - 0.5) * 30;
        // Create a more dramatic wave pattern
        const y = Math.sin(t * Math.PI * 3) * 2 + Math.cos(t * Math.PI * 5) * 0.5;
        const z = Math.cos(t * Math.PI * 2) * 1.5;

        points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 200, 0.2, 12, false);
    const material = new THREE.MeshPhongMaterial({
        color: 0x2c6a8c,
        shininess: 100,
        transparent: true,
        opacity: 0.8
    });
    const tube = new THREE.Mesh(geometry, material);

    timelineGroup.add(tube);

    // Add glow effect to the tube
    const glowGeometry = new THREE.TubeGeometry(curve, 200, 0.4, 12, false);
    const glowMaterial = new THREE.MeshPhongMaterial({
        color: 0x5ba6c9,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
    });
    const glowTube = new THREE.Mesh(glowGeometry, glowMaterial);
    timelineGroup.add(glowTube);

    // Add flowing particles along the timeline
    const flowingParticles = [];
    const flowingParticlesCount = 50;
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x89d0e1,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });

    for (let i = 0; i < flowingParticlesCount; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        const t = i / flowingParticlesCount;
        const position = curve.getPointAt(t);
        particle.position.copy(position);
        particle.userData = { t: t };
        flowingParticles.push(particle);
        timelineGroup.add(particle);
    }

    // Add interactive timeline events
    timelineData.forEach((event, index) => {
        const t = index / (timelineData.length - 1);
        const curvePoint = curve.getPointAt(t);

        // Create event marker (larger sphere)
        const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x5ba6c9,
            shininess: 100,
            emissive: 0x89d0e1,
            emissiveIntensity: 0.3
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        sphere.position.copy(curvePoint);
        timelineGroup.add(sphere);

        // Add outer ring for visual interest
        const ringGeometry = new THREE.TorusGeometry(1.2, 0.1, 16, 32);
        const ringMaterial = new THREE.MeshPhongMaterial({
            color: 0x89d0e1,
            transparent: true,
            opacity: 0.7
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(curvePoint);

        // Face the ring outward from the curve
        const tangent = curve.getTangentAt(t);
        const normal = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();
        ring.lookAt(normal.add(curvePoint));

        timelineGroup.add(ring);

        // Create text sprite for event details
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 256;

        // Draw text background with more opacity for visibility
        context.fillStyle = 'rgba(24, 52, 70, 0.9)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Add border
        context.strokeStyle = '#5ba6c9';
        context.lineWidth = 6;
        context.strokeRect(3, 3, canvas.width-6, canvas.height-6);

        // Draw text
        context.font = 'bold 28px Arial';
        context.fillStyle = '#89d0e1';
        context.textAlign = 'center';
        context.fillText(event.period, canvas.width / 2, 40);

        context.font = 'bold 36px Arial';
        context.fillStyle = '#ffffff';
        context.fillText(event.title, canvas.width / 2, 85);

        context.font = 'italic 26px Arial';
        context.fillStyle = '#cccccc';
        context.fillText(event.organization, canvas.width / 2, 130);

        context.font = '22px Arial';
        context.fillStyle = '#aaaaaa';

        // Text wrapping for description
        const maxWidth = 450;
        const words = event.description.split(' ');
        let line = '';
        let y = 170;

        for (const word of words) {
            const testLine = line + word + ' ';
            const metrics = context.measureText(testLine);

            if (metrics.width > maxWidth) {
                context.fillText(line, canvas.width / 2, y);
                line = word + ' ';
                y += 28;
            } else {
                line = testLine;
            }
        }
        context.fillText(line, canvas.width / 2, y);

        // Create texture
        const texture = new THREE.CanvasTexture(canvas);

        // Create material
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });

        // Create sprite
        const sprite = new THREE.Sprite(spriteMaterial);

        // Position sprite offset from the curve point
        const spriteOffsetDirection = new THREE.Vector3(0, 1, 0);
        if (index % 2 === 0) {
            spriteOffsetDirection.set(0, 3, 1);
        } else {
            spriteOffsetDirection.set(0, -3, 1);
        }

        sprite.position.copy(curvePoint).add(spriteOffsetDirection);
        sprite.scale.set(7, 3.5, 1);

        timelineGroup.add(sprite);

        // Save original values for interaction
        sprite.userData = {
            originalScale: sprite.scale.clone(),
            originalPosition: sprite.position.clone(),
            curvePoint: curvePoint.clone(),
            offsetDirection: spriteOffsetDirection.clone()
        };

        // Make timeline nodes interactive
        sphere.userData = {
            sprite: sprite,
            ring: ring,
            index: index,
            hovered: false
        };

        // Add subtle animation to the ring
        ring.userData = {
            rotationSpeed: 0.01,
            originalScale: ring.scale.clone()
        };
    });

    scene.add(timelineGroup);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add point lights for visual interest
    const pointLight1 = new THREE.PointLight(0x5ba6c9, 1, 30);
    pointLight1.position.set(15, -10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x89d0e1, 1, 30);
    pointLight2.position.set(-15, 10, -10);
    scene.add(pointLight2);

    // Create raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let intersectedObject = null;

    // Mouse move event listener
    timelineContainer.addEventListener('mousemove', (event) => {
        // Calculate mouse position in normalized device coordinates (-1 to +1)
        const rect = timelineContainer.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    });

    // Mouse interaction for timeline nodes
    function checkIntersections() {
        raycaster.setFromCamera(mouse, camera);

        // Find objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(timelineGroup.children, true);

        // Reset previously intersected object
        if (intersectedObject && (!intersects.length || intersects[0].object !== intersectedObject)) {
            if (intersectedObject.userData && intersectedObject.userData.sprite) {
                const sprite = intersectedObject.userData.sprite;
                const ring = intersectedObject.userData.ring;

                // Animate back to original state
                gsap.to(sprite.scale, {
                    x: sprite.userData.originalScale.x,
                    y: sprite.userData.originalScale.y,
                    duration: 0.5
                });

                gsap.to(sprite.position, {
                    x: sprite.userData.originalPosition.x,
                    y: sprite.userData.originalPosition.y,
                    z: sprite.userData.originalPosition.z,
                    duration: 0.5
                });

                gsap.to(ring.scale, {
                    x: ring.userData.originalScale.x,
                    y: ring.userData.originalScale.y,
                    z: ring.userData.originalScale.z,
                    duration: 0.5
                });

                intersectedObject.userData.hovered = false;
            }

            intersectedObject = null;
        }

        // Set new intersected object
        if (intersects.length > 0) {
            const object = intersects[0].object;

            if (object.userData && object.userData.sprite && !object.userData.hovered) {
                intersectedObject = object;
                intersectedObject.userData.hovered = true;

                const sprite = intersectedObject.userData.sprite;
                const ring = intersectedObject.userData.ring;

                // Animate to highlight state
                gsap.to(sprite.scale, {
                    x: sprite.userData.originalScale.x * 1.2,
                    y: sprite.userData.originalScale.y * 1.2,
                    duration: 0.5
                });

                // Move sprite closer to camera
                const newPosition = sprite.userData.curvePoint.clone()
                    .add(sprite.userData.offsetDirection.clone().multiplyScalar(1.5));

                gsap.to(sprite.position, {
                    x: newPosition.x,
                    y: newPosition.y,
                    z: newPosition.z,
                    duration: 0.5
                });

                // Scale up the ring
                gsap.to(ring.scale, {
                    x: 1.3,
                    y: 1.3,
                    z: 1.3,
                    duration: 0.5
                });
            }
        }
    }

    // Add auto-rotation controls
    let autoRotate = true;
    const rotationSpeed = 0.002;
    let targetRotationY = 0;

    timelineContainer.addEventListener('click', () => {
        autoRotate = !autoRotate;
    });

    // Mouse for interactive rotation
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Check for intersections
        checkIntersections();

        // Auto-rotate or interactive rotation
        if (autoRotate) {
            targetRotationY += rotationSpeed;
            timelineGroup.rotation.y += (targetRotationY - timelineGroup.rotation.y) * 0.05;
        } else {
            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;
            timelineGroup.rotation.y += 0.1 * (targetX - timelineGroup.rotation.y);
            timelineGroup.rotation.x += 0.1 * (targetY - timelineGroup.rotation.x);
        }

        // Animate flowing particles
        flowingParticles.forEach(particle => {
            particle.userData.t += 0.001;
            if (particle.userData.t > 1) particle.userData.t = 0;

            const position = curve.getPointAt(particle.userData.t);
            particle.position.copy(position);
        });

        // Animate rings
        timelineGroup.children.forEach(child => {
            if (child.userData && child.userData.rotationSpeed) {
                child.rotation.z += child.userData.rotationSpeed;
            }
        });

        // Pulsate the glow
        const time = performance.now() * 0.001;
        glowTube.material.opacity = 0.2 + Math.sin(time) * 0.1;

        renderer.render(scene, camera);
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = timelineContainer.clientWidth / timelineContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(timelineContainer.clientWidth, timelineContainer.clientHeight);
    });

    // Start animation
    animate();
}