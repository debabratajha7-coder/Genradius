"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Environment, RoundedBox } from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import type { ProductLean } from "@/types/catalog";

const REEL_SRC = "/media/watch-reel.mp4";
const BACK_TEX = "/models/iphone/textures/17ProMax_2222_baseColor.png";

function ScreenContent({
  products,
  facingFront,
}: {
  products: ProductLean[];
  facingFront: boolean;
}) {
  const [videoTex, setVideoTex] = useState<THREE.VideoTexture | null>(null);
  const [slide, setSlide] = useState(0);
  const videoEl = useRef<HTMLVideoElement | null>(null);

  const images = useMemo(() => {
    const urls = products.map((p) => p.images[0]).filter(Boolean);
    return urls.length ? urls.slice(0, 6) : [BACK_TEX];
  }, [products]);

  const slideTextures = useLoader(THREE.TextureLoader, images);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = REEL_SRC;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    videoEl.current = video;

    const onReady = () => {
      const tex = new THREE.VideoTexture(video);
      tex.colorSpace = THREE.SRGBColorSpace;
      setVideoTex(tex);
      void video.play().catch(() => undefined);
    };
    const onFail = () => setVideoTex(null);

    video.addEventListener("loadeddata", onReady);
    video.addEventListener("error", onFail);
    video.load();

    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
      videoEl.current = null;
      setVideoTex((t) => {
        t?.dispose();
        return null;
      });
    };
  }, []);

  useEffect(() => {
    if (videoTex || images.length < 2) return;
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % images.length);
    }, 2200);
    return () => clearInterval(id);
  }, [videoTex, images.length]);

  useEffect(() => {
    const v = videoEl.current;
    if (!v || !videoTex) return;
    if (facingFront) void v.play().catch(() => undefined);
    else v.pause();
  }, [facingFront, videoTex]);

  useFrame(() => {
    if (videoTex) videoTex.needsUpdate = true;
  });

  const slides = Array.isArray(slideTextures)
    ? slideTextures
    : [slideTextures];
  const map = videoTex ?? slides[slide % slides.length];
  if (map) map.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh position={[0, 0.02, 0.065]} raycast={() => null}>
      <planeGeometry args={[0.86, 1.86]} />
      <meshBasicMaterial map={map} toneMapped={false} />
    </mesh>
  );
}

function IPhoneModel({
  progress,
  products,
}: {
  progress: number;
  products: ProductLean[];
}) {
  const group = useRef<THREE.Group>(null);
  const backMap = useLoader(THREE.TextureLoader, BACK_TEX);
  backMap.colorSpace = THREE.SRGBColorSpace;

  const eased = 1 - Math.pow(1 - progress, 2);
  const rotY = Math.PI * (1 - eased);
  const rotX = THREE.MathUtils.lerp(-0.2, 0.08, eased);
  const facingFront = progress > 0.55;

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      rotY,
      0.1,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      rotX,
      0.1,
    );
  });

  return (
    <group ref={group} position={[0, -0.05, 0]} scale={1.15}>
      <RoundedBox args={[1.02, 2.12, 0.11]} radius={0.08} smoothness={6}>
        <meshStandardMaterial
          color="#8a8680"
          metalness={0.95}
          roughness={0.25}
        />
      </RoundedBox>

      <mesh position={[0, 0, -0.056]}>
        <planeGeometry args={[0.94, 2.02]} />
        <meshStandardMaterial map={backMap} metalness={0.4} roughness={0.35} />
      </mesh>

      <RoundedBox
        args={[0.42, 0.42, 0.04]}
        radius={0.06}
        smoothness={4}
        position={[-0.22, 0.72, -0.078]}
      >
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </RoundedBox>
      {[
        [-0.3, 0.8],
        [-0.14, 0.8],
        [-0.3, 0.64],
        [-0.14, 0.64],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, -0.1]}>
          <circleGeometry args={[0.055, 32]} />
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}

      <RoundedBox
        args={[0.96, 2.04, 0.02]}
        radius={0.07}
        smoothness={6}
        position={[0, 0, 0.055]}
      >
        <meshStandardMaterial color="#0c0c0c" roughness={0.4} />
      </RoundedBox>

      <Suspense fallback={null}>
        <ScreenContent products={products} facingFront={facingFront} />
      </Suspense>

      <RoundedBox
        args={[0.28, 0.07, 0.01]}
        radius={0.03}
        smoothness={4}
        position={[0, 0.88, 0.068]}
      >
        <meshStandardMaterial color="#050505" />
      </RoundedBox>
    </group>
  );
}

function SceneSync({ progress }: { progress: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0.1, 4.2);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(4.6, 3.6, progress);
  });
  return null;
}

export function WatchAndBuyPhone({
  progress,
  products,
}: {
  progress: number;
  products: ProductLean[];
}) {
  return (
    <div className="h-full w-full">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.1, 4.2], fov: 35 }}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 6, 4]} intensity={1.2} />
        <directionalLight
          position={[-3, 2, -4]}
          intensity={0.45}
          color="#be9c7d"
        />
        <Suspense fallback={null}>
          <IPhoneModel progress={progress} products={products} />
          <Environment preset="city" />
        </Suspense>
        <SceneSync progress={progress} />
      </Canvas>
    </div>
  );
}
