import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// ─── Types ────────────────────────────────────────────────────────────────────
type ProductId = "window" | "door" | "acp" | "curtain-wall" | "partition";
type FrameColorId = "silver" | "black" | "bronze" | "white" | "champagne";
type GlassTypeId = "clear" | "blue-tint" | "bronze-tint" | "frosted" | "reflective";
type SeriesId = "standard" | "premium" | "heavy";
type OpeningStyleId = "fixed" | "sliding" | "casement" | "tilt-turn";
type ACPFinishId = "silver-metallic" | "brushed" | "copper" | "white-matt" | "charcoal";

interface ThreeVisualizerProps {
  product: ProductId;
  frameColor: FrameColorId;
  glassType: GlassTypeId;
  series: SeriesId;
  opening: OpeningStyleId;
  acpFinish: ACPFinishId;
  isOpen: boolean;
}

// ─── Config Colors ────────────────────────────────────────────────────────────
const FRAME_COLORS: Record<FrameColorId, { hex: number; metalness: number; roughness: number; label: string }> = {
  silver: { hex: 0xa8b0bc, metalness: 0.95, roughness: 0.22, label: "Anodized Silver" },
  black: { hex: 0x1c1c1e, metalness: 0.8, roughness: 0.45, label: "Matte Black" },
  bronze: { hex: 0x7a5c2e, metalness: 0.88, roughness: 0.3, label: "Warm Bronze" },
  white: { hex: 0xeef0f2, metalness: 0.2, roughness: 0.5, label: "Pearl White" },
  champagne: { hex: 0xc9a84c, metalness: 0.92, roughness: 0.24, label: "Champagne Gold" },
};

const GLASS_TYPES: Record<GlassTypeId, { hex: number; transmission: number; opacity: number; roughness: number; metalness: number; ior: number }> = {
  clear: { hex: 0xb4d7f0, transmission: 0.95, opacity: 0.2, roughness: 0.05, metalness: 0.1, ior: 1.5 },
  "blue-tint": { hex: 0x1d4ed8, transmission: 0.75, opacity: 0.45, roughness: 0.05, metalness: 0.15, ior: 1.52 },
  "bronze-tint": { hex: 0x6b441e, transmission: 0.7, opacity: 0.5, roughness: 0.05, metalness: 0.15, ior: 1.52 },
  frosted: { hex: 0xd2e2ee, transmission: 0.35, opacity: 0.85, roughness: 0.65, metalness: 0.1, ior: 1.48 },
  reflective: { hex: 0x475569, transmission: 0.3, opacity: 0.75, roughness: 0.02, metalness: 0.95, ior: 1.6 },
};

const ACP_FINISHES: Record<ACPFinishId, { hex: number; metalness: number; roughness: number }> = {
  "silver-metallic": { hex: 0xb8bec8, metalness: 0.9, roughness: 0.25 },
  brushed: { hex: 0x8a9099, metalness: 0.95, roughness: 0.35 },
  copper: { hex: 0xb07040, metalness: 0.85, roughness: 0.28 },
  "white-matt": { hex: 0xedeef0, metalness: 0.15, roughness: 0.8 },
  charcoal: { hex: 0x3a3e48, metalness: 0.2, roughness: 0.7 },
};

export function ThreeVisualizer({
  product,
  frameColor,
  glassType,
  series,
  opening,
  acpFinish,
  isOpen,
}: ThreeVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<{
    slidingProgress: number;
    swingProgress: number;
    tiltProgress: number;
  }>({
    slidingProgress: 0,
    swingProgress: 0,
    tiltProgress: 0,
  });

  const objectsRef = useRef<{
    windowRightPane?: THREE.Group;
    windowLeftPane?: THREE.Group;
    doorLeaf?: THREE.Group;
    partitionDoor?: THREE.Group;
  }>({});

  useEffect(() => {
    if (!containerRef.current) return;

    // ─── Scene Setup ──────────────────────────────────────────────────────────
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x131820); // Deep rich background matching layout
    scene.fog = new THREE.FogExp2(0x131820, 0.08);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 1.95; // Don't orbit below ground
    controls.minDistance = 2;
    controls.maxDistance = 8;
    controls.target.set(0, 0, 0);

    // ─── Environment & Lighting ────────────────────────────────────────────────
    // Soft sky light reflection
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.5);
    scene.add(hemiLight);

    // Warm Sun/Studio Key light casting nice soft shadows
    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.2);
    dirLight.position.set(5, 6, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0005;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 15;
    dirLight.shadow.camera.left = -2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = -2;
    scene.add(dirLight);

    // Cool studio Fill light on opposite side
    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.6);
    fillLight.position.set(-5, 2, -3);
    scene.add(fillLight);

    // Subtle Spot light highlighting metallic edge reflections
    const rimLight = new THREE.SpotLight(0xffffff, 2, 8, Math.PI / 6, 0.5, 1);
    rimLight.position.set(0, 4, 3);
    rimLight.target.position.set(0, 0, 0);
    scene.add(rimLight);

    // Ground Plane with shadow receiver
    const groundGeo = new THREE.PlaneGeometry(15, 15);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.4 });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -1.45;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Floor grid for technical look
    const gridHelper = new THREE.GridHelper(10, 20, 0x334155, 0x1e293b);
    gridHelper.position.y = -1.44;
    scene.add(gridHelper);

    // ─── Build Materials dynamically ──────────────────────────────────────────
    const getMaterials = () => {
      const f = FRAME_COLORS[frameColor];
      const g = GLASS_TYPES[glassType];
      const ac = ACP_FINISHES[acpFinish];

      // Physical metallic frame profile
      const frameMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(f.hex),
        metalness: f.metalness,
        roughness: f.roughness,
        clearcoat: f.metalness > 0.5 ? 0.35 : 0.05,
        clearcoatRoughness: 0.2,
        reflectivity: f.metalness > 0.5 ? 0.9 : 0.4,
      });

      // Hyper-realistic architectural glass
      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(g.hex),
        transmission: g.transmission,
        opacity: g.opacity,
        transparent: true,
        roughness: g.roughness,
        metalness: g.metalness,
        ior: g.ior,
        thickness: 0.05, // Depth thickness for physical transmission refraction
        specularIntensity: 1.0,
        specularColor: new THREE.Color(0xffffff),
      });

      // ACP panels material
      const acpMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(ac.hex),
        metalness: ac.metalness,
        roughness: ac.roughness,
        clearcoat: ac.metalness > 0.5 ? 0.4 : 0.0,
        clearcoatRoughness: 0.3,
      });

      // Joint groove backing material (dark)
      const backingMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x0f172a),
        roughness: 0.9,
        metalness: 0.1,
      });

      // Bright polished steel for handles
      const handleMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xe2e8f0),
        metalness: 0.95,
        roughness: 0.1,
      });

      return { frameMaterial, glassMaterial, acpMaterial, backingMaterial, handleMaterial };
    };

    // ─── Model Construction logic ─────────────────────────────────────────────
    let activeModelGroup = new THREE.Group();
    scene.add(activeModelGroup);

    // Helper to extrude/build clean boxes
    const createBox = (w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    const buildModel = () => {
      // Clear previous meshes
      while (activeModelGroup.children.length > 0) {
        const obj = activeModelGroup.children[0];
        activeModelGroup.remove(obj);
      }

      objectsRef.current = {};
      const mats = getMaterials();

      // Profile thickness scaling
      const thickMult = series === "heavy" ? 1.4 : series === "premium" ? 1.0 : 0.7;
      const profileW = 0.08 * thickMult;
      const profileD = 0.1 * thickMult;

      if (product === "window") {
        // WINDOW DIMENSIONS: W=1.8, H=1.8
        const wWidth = 1.8;
        const wHeight = 1.8;

        // 1. Outer Frame (Top, Bottom, Left, Right)
        const outerFrame = new THREE.Group();
        // Top
        outerFrame.add(createBox(wWidth, profileW, profileD, mats.frameMaterial, 0, wHeight / 2 - profileW / 2, 0));
        // Bottom
        outerFrame.add(createBox(wWidth, profileW, profileD, mats.frameMaterial, 0, -wHeight / 2 + profileW / 2, 0));
        // Left
        outerFrame.add(createBox(profileW, wHeight - 2 * profileW, profileD, mats.frameMaterial, -wWidth / 2 + profileW / 2, 0, 0));
        // Right
        outerFrame.add(createBox(profileW, wHeight - 2 * profileW, profileD, mats.frameMaterial, wWidth / 2 - profileW / 2, 0, 0));
        // Middle Mullion
        outerFrame.add(createBox(profileW, wHeight - 2 * profileW, profileD, mats.frameMaterial, 0, 0, 0));
        activeModelGroup.add(outerFrame);

        // 2. Left Pane (Casement/Tilt or Fixed)
        const leftPaneGroup = new THREE.Group();
        // Pivot point at hinge side (outer left edge: x = -wWidth/2 + profileW)
        leftPaneGroup.position.set(-wWidth / 4, 0, 0);

        const innerLeft = new THREE.Group();
        const innerW = wWidth / 2 - profileW * 1.5;
        const innerH = wHeight - profileW * 2;
        const sW = 0.04; // sash profile width

        // Inner sash frame
        innerLeft.add(createBox(innerW, sW, profileD * 0.8, mats.frameMaterial, 0, innerH / 2 - sW / 2, 0));
        innerLeft.add(createBox(innerW, sW, profileD * 0.8, mats.frameMaterial, 0, -innerH / 2 + sW / 2, 0));
        innerLeft.add(createBox(sW, innerH - 2 * sW, profileD * 0.8, mats.frameMaterial, -innerW / 2 + sW / 2, 0, 0));
        innerLeft.add(createBox(sW, innerH - 2 * sW, profileD * 0.8, mats.frameMaterial, innerW / 2 - sW / 2, 0, 0));
        // Glass
        innerLeft.add(createBox(innerW - sW * 2, innerH - sW * 2, 0.015, mats.glassMaterial, 0, 0, 0));

        // Add sash handle
        if (opening === "casement" || opening === "tilt-turn") {
          const handleGroup = new THREE.Group();
          handleGroup.position.set(innerW / 2 - 0.06, 0, profileD * 0.4);
          handleGroup.add(createBox(0.015, 0.12, 0.015, mats.handleMaterial, 0, 0, 0.01)); // handle base
          handleGroup.add(createBox(0.08, 0.015, 0.015, mats.handleMaterial, 0.03, 0, 0.02)); // handle lever
          innerLeft.add(handleGroup);
        }

        leftPaneGroup.add(innerLeft);
        activeModelGroup.add(leftPaneGroup);
        objectsRef.current.windowLeftPane = leftPaneGroup;

        // 3. Right Pane (Sliding or Fixed)
        const rightPaneGroup = new THREE.Group();
        // Shifted slightly along Z axis to allow overlapping bypass when sliding
        const zOffset = opening === "sliding" ? profileD * 0.3 : 0;
        rightPaneGroup.position.set(wWidth / 4, 0, zOffset);

        const innerRight = new THREE.Group();
        // Inner sash frame
        innerRight.add(createBox(innerW, sW, profileD * 0.8, mats.frameMaterial, 0, innerH / 2 - sW / 2, 0));
        innerRight.add(createBox(innerW, sW, profileD * 0.8, mats.frameMaterial, 0, -innerH / 2 + sW / 2, 0));
        innerRight.add(createBox(sW, innerH - 2 * sW, profileD * 0.8, mats.frameMaterial, -innerW / 2 + sW / 2, 0, 0));
        innerRight.add(createBox(sW, innerH - 2 * sW, profileD * 0.8, mats.frameMaterial, innerW / 2 - sW / 2, 0, 0));
        // Glass
        innerRight.add(createBox(innerW - sW * 2, innerH - sW * 2, 0.015, mats.glassMaterial, 0, 0, 0));

        // Slider latch
        if (opening === "sliding") {
          const latch = createBox(0.015, 0.1, 0.015, mats.handleMaterial, -innerW / 2 + 0.04, 0, profileD * 0.4);
          innerRight.add(latch);
        }

        rightPaneGroup.add(innerRight);
        activeModelGroup.add(rightPaneGroup);
        objectsRef.current.windowRightPane = rightPaneGroup;
      } 
      
      else if (product === "door") {
        // DOOR DIMENSIONS: W=1.3, H=2.3
        const dW = 1.3;
        const dH = 2.3;

        // Outer Frame jambs (Left, Right, Top)
        const outerJamb = new THREE.Group();
        outerJamb.add(createBox(dW, profileW, profileD, mats.frameMaterial, 0, dH / 2 - profileW / 2, 0));
        outerJamb.add(createBox(profileW, dH - profileW, profileD, mats.frameMaterial, -dW / 2 + profileW / 2, -profileW / 2, 0));
        outerJamb.add(createBox(profileW, dH - profileW, profileD, mats.frameMaterial, dW / 2 - profileW / 2, -profileW / 2, 0));
        // Sleek floor sill
        outerJamb.add(createBox(dW, 0.02, profileD * 0.9, mats.frameMaterial, 0, -dH / 2 + 0.01, 0));
        activeModelGroup.add(outerJamb);

        // Door leaf (Swinging around hinge side x = -dW/2 + profileW)
        const leafGroup = new THREE.Group();
        leafGroup.position.set(-dW / 2 + profileW, -profileW, 0); // Origin at hinge axis

        const leafSub = new THREE.Group();
        // Shift door mesh so its relative rotation center aligns with hinge
        const lW = dW - profileW * 2 - 0.01;
        const lH = dH - profileW - 0.03;
        const sW = 0.09; // wider door sash profile
        leafSub.position.set(lW / 2, 0, 0);

        // Door leaf perimeter sash
        leafSub.add(createBox(lW, sW, profileD * 0.85, mats.frameMaterial, 0, lH / 2 - sW / 2, 0)); // Top
        leafSub.add(createBox(lW, sW * 1.5, profileD * 0.85, mats.frameMaterial, 0, -lH / 2 + (sW * 1.5) / 2, 0)); // Bottom kick plate
        leafSub.add(createBox(sW, lH - sW * 2.5, profileD * 0.85, mats.frameMaterial, -lW / 2 + sW / 2, sW * 0.25, 0)); // Left sash
        leafSub.add(createBox(sW, lH - sW * 2.5, profileD * 0.85, mats.frameMaterial, lW / 2 - sW / 2, sW * 0.25, 0)); // Right sash

        // Middle horizontal transom
        const transY = -0.15;
        leafSub.add(createBox(lW - 2 * sW, 0.07, profileD * 0.8, mats.frameMaterial, 0, transY, 0));

        // Top Glass sheet
        const glassH = lH / 2 - sW / 2 - transY - 0.03;
        const glassY = (lH / 2 - sW / 2 + transY + 0.035) / 2;
        leafSub.add(createBox(lW - 2 * sW, glassH, 0.018, mats.glassMaterial, 0, glassY, 0));

        // Bottom metal panel
        const bottomH = transY - (-lH / 2 + sW * 1.5) - 0.035;
        const bottomY = (transY + (-lH / 2 + sW * 1.5) + 0.035) / 2;
        leafSub.add(createBox(lW - 2 * sW, bottomH, 0.025, mats.frameMaterial, 0, bottomY, 0));

        // Premium long vertical stainless tubular handle
        const handleGroup = new THREE.Group();
        handleGroup.position.set(lW / 2 - 0.12, 0.1, profileD * 0.5);
        // Handle bar (long cylinder)
        const barGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.9, 12);
        const barMesh = new THREE.Mesh(barGeo, mats.handleMaterial);
        barMesh.castShadow = true;
        handleGroup.add(barMesh);
        // Handle supports (small horizontal links)
        handleGroup.add(createBox(0.015, 0.015, 0.05, mats.handleMaterial, 0, 0.35, -0.025));
        handleGroup.add(createBox(0.015, 0.015, 0.05, mats.handleMaterial, 0, -0.35, -0.025));
        leafSub.add(handleGroup);

        leafGroup.add(leafSub);
        activeModelGroup.add(leafGroup);
        objectsRef.current.doorLeaf = leafGroup;
      } 
      
      else if (product === "acp") {
        // ACP FACADE PANEL SYSTEM (3x3 grid layout)
        const gridGroup = new THREE.Group();
        const pW = 0.75;
        const pH = 0.55;
        const gap = 0.02;

        // Dark backplane structure
        gridGroup.add(createBox(2.4, 1.8, 0.02, mats.backingMaterial, 0, 0, -0.03));

        // Build 3x3 layout of beveled modular ACP panels
        for (let row = -1; row <= 1; row++) {
          for (let col = -1; col <= 1; col++) {
            const x = col * (pW + gap);
            const y = row * (pH + gap);

            // Front panel box
            const panel = createBox(pW, pH, 0.03, mats.acpMaterial, x, y, 0);
            gridGroup.add(panel);

            // Inner trim joint backing line
            if (col < 1) {
              const verticalGroove = createBox(gap, 1.8, 0.01, mats.frameMaterial, x + pW / 2 + gap / 2, 0, -0.01);
              gridGroup.add(verticalGroove);
            }
            if (row < 1) {
              const horizontalGroove = createBox(2.4, gap, 0.01, mats.frameMaterial, 0, y + pH / 2 + gap / 2, -0.01);
              gridGroup.add(horizontalGroove);
            }
          }
        }
        activeModelGroup.add(gridGroup);
      } 
      
      else if (product === "curtain-wall") {
        // MODERN ARCHITECTURAL FACADE GRID (4 cols x 3 rows)
        const gridW = 2.4;
        const gridH = 2.0;
        const cols = 3;
        const rows = 2;
        const stepX = gridW / cols;
        const stepY = gridH / rows;

        const cwGroup = new THREE.Group();

        // 1. Heavy vertical mullions
        for (let c = 0; c <= cols; c++) {
          const x = -gridW / 2 + c * stepX;
          cwGroup.add(createBox(0.04, gridH, 0.12, mats.frameMaterial, x, 0, 0));
        }
        // 2. Heavy horizontal transoms
        for (let r = 0; r <= rows; r++) {
          const y = -gridH / 2 + r * stepY;
          cwGroup.add(createBox(gridW, 0.04, 0.1, mats.frameMaterial, 0, y, 0));
        }

        // 3. Huge double-glazed structural glass sheets
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const x = -gridW / 2 + c * stepX + stepX / 2;
            const y = -gridH / 2 + r * stepY + stepY / 2;
            const pane = createBox(stepX - 0.04, stepY - 0.04, 0.02, mats.glassMaterial, x, y, 0.025);
            cwGroup.add(pane);
          }
        }

        activeModelGroup.add(cwGroup);
      } 
      
      else if (product === "partition") {
        // COMMERCIAL SLIM PARTITION WALL WITH A SWING GLASS DOOR
        const pW = 2.8;
        const pH = 2.2;
        const trackH = 0.04;
        const trackD = 0.06;

        const partGroup = new THREE.Group();

        // Top ceiling track
        partGroup.add(createBox(pW, trackH, trackD, mats.frameMaterial, 0, pH / 2 - trackH / 2, 0));
        // Floor track
        partGroup.add(createBox(pW, trackH, trackD, mats.frameMaterial, 0, -pH / 2 + trackH / 2, 0));

        // Fixed sidelight glass panels (Left side x = -0.95, and Right side x = 0.95)
        const sideW = 0.85;
        const glassH = pH - trackH * 2;
        // Left glass
        partGroup.add(createBox(sideW, glassH, 0.015, mats.glassMaterial, -pW / 2 + sideW / 2, 0, 0));
        partGroup.add(createBox(0.02, glassH, trackD, mats.frameMaterial, -pW / 2 + sideW, 0, 0)); // slim vertical mullion
        // Right glass
        partGroup.add(createBox(sideW, glassH, 0.015, mats.glassMaterial, pW / 2 - sideW / 2, 0, 0));
        partGroup.add(createBox(0.02, glassH, trackD, mats.frameMaterial, pW / 2 - sideW, 0, 0)); // slim vertical mullion

        // Center glass swing door (door fits between mullions)
        const doorGroup = new THREE.Group();
        const doorW = pW - sideW * 2 - 0.04; // width ~ 1.02m
        doorGroup.position.set(-pW / 2 + sideW + 0.02, 0, 0); // Swing pivot on left side vertical mullion

        const doorLeaf = new THREE.Group();
        doorLeaf.position.set(doorW / 2, 0, 0);
        // Glass door pane
        doorLeaf.add(createBox(doorW, glassH - 0.02, 0.015, mats.glassMaterial, 0, 0, 0));
        // Top and bottom chrome patch fittings
        doorLeaf.add(createBox(0.18, 0.06, 0.025, mats.handleMaterial, -doorW / 2 + 0.09, glassH / 2 - 0.04, 0));
        doorLeaf.add(createBox(0.18, 0.06, 0.025, mats.handleMaterial, -doorW / 2 + 0.09, -glassH / 2 + 0.04, 0));

        // High-end stainless steel vertical door pull bar
        const pullBar = new THREE.Group();
        pullBar.position.set(doorW / 2 - 0.08, 0, 0.05);
        const barGeo = new THREE.CylinderGeometry(0.01, 0.01, 1.2, 12);
        const barMesh = new THREE.Mesh(barGeo, mats.handleMaterial);
        barMesh.castShadow = true;
        pullBar.add(barMesh);
        // Supports
        pullBar.add(createBox(0.01, 0.01, 0.04, mats.handleMaterial, 0, 0.5, -0.02));
        pullBar.add(createBox(0.01, 0.01, 0.04, mats.handleMaterial, 0, -0.5, -0.02));
        doorLeaf.add(pullBar);

        doorGroup.add(doorLeaf);
        partGroup.add(doorGroup);
        activeModelGroup.add(partGroup);
        objectsRef.current.partitionDoor = doorGroup;
      }
    };

    // Build the initial model layout
    buildModel();

    // ─── Animation Frame ticks ───────────────────────────────────────────────
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Lerp speeds for smooth 3D interactions
      const lerpSpeed = 0.08;

      // Handle window movements
      if (product === "window") {
        if (opening === "sliding") {
          // Slide right pane sideways
          const target = isOpen ? -0.4 : 0.0;
          animRef.current.slidingProgress = THREE.MathUtils.lerp(animRef.current.slidingProgress, target, lerpSpeed);
          if (objectsRef.current.windowRightPane) {
            objectsRef.current.windowRightPane.position.x = 0.45 + animRef.current.slidingProgress;
          }
          // Reset other pane transforms
          if (objectsRef.current.windowLeftPane) {
            objectsRef.current.windowLeftPane.rotation.set(0, 0, 0);
          }
        } else if (opening === "casement") {
          // Swing left pane open outward (around vertical left edge y-axis)
          // Since hinge is at left edge relative to pivot group
          const targetRot = isOpen ? -Math.PI / 2.8 : 0;
          animRef.current.swingProgress = THREE.MathUtils.lerp(animRef.current.swingProgress, targetRot, lerpSpeed);
          if (objectsRef.current.windowLeftPane) {
            // Apply swing around left hinge
            objectsRef.current.windowLeftPane.rotation.y = animRef.current.swingProgress;
          }
          // Reset others
          if (objectsRef.current.windowRightPane) {
            objectsRef.current.windowRightPane.position.set(0.45, 0, 0);
          }
        } else if (opening === "tilt-turn") {
          // Tilt left pane inward from the bottom
          const targetTilt = isOpen ? Math.PI / 18 : 0;
          animRef.current.tiltProgress = THREE.MathUtils.lerp(animRef.current.tiltProgress, targetTilt, lerpSpeed);
          if (objectsRef.current.windowLeftPane) {
            objectsRef.current.windowLeftPane.rotation.x = animRef.current.tiltProgress;
          }
          // Reset others
          if (objectsRef.current.windowRightPane) {
            objectsRef.current.windowRightPane.position.set(0.45, 0, 0);
          }
        } else {
          // Fixed - reset everything
          if (objectsRef.current.windowLeftPane) {
            objectsRef.current.windowLeftPane.rotation.set(0, 0, 0);
          }
          if (objectsRef.current.windowRightPane) {
            objectsRef.current.windowRightPane.position.set(0.45, 0, 0);
          }
        }
      }

      // Handle swing door opening
      else if (product === "door") {
        const targetRot = isOpen ? -Math.PI / 2.8 : 0;
        animRef.current.swingProgress = THREE.MathUtils.lerp(animRef.current.swingProgress, targetRot, lerpSpeed);
        if (objectsRef.current.doorLeaf) {
          objectsRef.current.doorLeaf.rotation.y = animRef.current.swingProgress;
        }
      }

      // Handle partition glass door opening
      else if (product === "partition") {
        const targetRot = isOpen ? Math.PI / 2.6 : 0; // Swing open inward/outward
        animRef.current.swingProgress = THREE.MathUtils.lerp(animRef.current.swingProgress, targetRot, lerpSpeed);
        if (objectsRef.current.partitionDoor) {
          objectsRef.current.partitionDoor.rotation.y = animRef.current.swingProgress;
        }
      }

      // Add a slow floating rotation to the ACP facade panel or Curtain wall if not interacting
      if (product === "acp" || product === "curtain-wall") {
        activeModelGroup.rotation.y = Math.sin(Date.now() * 0.0005) * 0.06;
      } else {
        activeModelGroup.rotation.y = 0;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // ─── Resize Handler ───────────────────────────────────────────────────────
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // ─── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();

      // Dispose Three.js objects to avoid heavy memory leaks
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [product, frameColor, glassType, series, opening, acpFinish, isOpen]);

  return (
    <div className="w-full h-full relative group">
      {/* Three.js viewport container */}
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Orbit control user tip */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-jet/80 backdrop-blur-md border border-border/50 text-[10px] text-muted-foreground/90 px-3 py-1 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        🖱️ Drag to orbit · Scroll to zoom · Right-click to pan
      </div>
    </div>
  );
}
