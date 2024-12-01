import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, Sky } from "@react-three/drei";

type AltitudeScalingParams = {
  altitude: number;
  minAltitude: number;
  maxAltitude: number;
  min3DAltitude: number;
  max3DAltitude: number;
};

function scaleAltitude({
  altitude,
  minAltitude,
  maxAltitude,
  min3DAltitude,
  max3DAltitude,
}: AltitudeScalingParams): number {
  // Ensure we stay within bounds to avoid going out of range
  const clampedAltitude = Math.min(
    Math.max(altitude, minAltitude),
    maxAltitude
  );

  return (
    ((clampedAltitude - minAltitude) / (maxAltitude - minAltitude)) *
      (max3DAltitude - min3DAltitude) +
    min3DAltitude
  );
}

type ModelProps = {
  altitude: number;
  pitch: number;
  roll: number;
};

const Model = React.forwardRef(({ altitude, pitch, roll }: ModelProps, ref) => {
  const model = useGLTF("/paper_airplane_gltf/scene.gltf");

  const scaledAltitude = scaleAltitude({
    altitude,
    minAltitude: 0,
    maxAltitude: 5000,
    min3DAltitude: 0, // Start at 1 to ensure it is above the ground
    max3DAltitude: 20, // Increase to make altitude more visually distinct
  });

  useEffect(() => {
    // Compute the bounding box of the model
    const box = new THREE.Box3().setFromObject(model.scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    model.scene.position.sub(center);

    // Enable shadows and adjust materials
    model.scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        if (node.material) {
          (node.material as THREE.MeshStandardMaterial).roughness = 1;
          (node.material as THREE.MeshStandardMaterial).metalness = 0;
        }
      }
    });
  }, [model]);

  return (
    <primitive
      ref={ref}
      object={model.scene}
      scale={[5, 5, 5]}
      position={[0, scaledAltitude, 0]}
      rotation={[
        THREE.MathUtils.degToRad(pitch), // Pitch around X-axis
        0, // Yaw around Y-axis
        THREE.MathUtils.degToRad(roll), // Roll around Z-axis
      ]}
    />
  );
});

// Scene Component
type SceneProps = { altitude: number; pitch: number; roll: number };
const Scene = ({ altitude, pitch, roll }: SceneProps) => {
  const modelRef = useRef();
  const { camera } = useThree();

  useFrame(() => {
    if (modelRef.current) {
      const modelBounds = new THREE.Box3().setFromObject(modelRef.current);
      const center = new THREE.Vector3();
      modelBounds.getCenter(center);

      // Set the camera to an isometric position relative to the center of the model
      const isometricOffset = new THREE.Vector3(0, 0, 3); // Adjust these values for desired view
      const cameraPosition = center.clone().add(isometricOffset);

      // Smoothly interpolate the camera position towards the desired position
      camera.position.lerp(cameraPosition, 1);

      // Make the camera look at the center of the model
      camera.lookAt(center);
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

      {/* Sky */}
      <Sky
        distance={450000}
        // sunPosition={[5, 10, 5]}
        // high noon
        sunPosition={[0, -1, 0]}
        turbidity={8}
        rayleigh={2}
        inclination={0}
        azimuth={0.25}
      />

      {/* Ground Plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#FFDD35" />
      </mesh>

      {/* Model */}
      <Suspense fallback={null}>
        <Model ref={modelRef} altitude={altitude} pitch={pitch} roll={roll} />
      </Suspense>
    </>
  );
};

// Avatar Component
const Avatar = ({ altitude = 0, pitch = 0, roll = 0 }) => (
  <Canvas
    shadows
    camera={{ position: [10, 10, 10], fov: 45 }}
    gl={{ antialias: false, powerPreference: "low-power" }}
  >
    <Scene altitude={altitude} pitch={pitch} roll={roll} />
  </Canvas>
);

useGLTF.preload("/paper_airplane_gltf/scene.gltf");

export default Avatar;
