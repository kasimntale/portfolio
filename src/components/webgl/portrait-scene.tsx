"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { ShaderMaterial, TextureLoader, Vector2, SRGBColorSpace } from "three";
import { useLoader } from "@react-three/fiber";
const vertexShader = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
const fragmentShader = `
uniform sampler2D uImage;
uniform vec2 uPointer;
uniform vec2 uResolution;
uniform float uReveal;
uniform float uFull;
uniform float uImageAspect;
varying vec2 vUv;
void main(){
 vec2 uv=vUv;
 float aspect=uResolution.x/uResolution.y;
 if(aspect>uImageAspect){uv.y=(uv.y-.5)*(uImageAspect/aspect)+.5;}else{uv.x=(uv.x-.5)*(aspect/uImageAspect)+.5;}
 vec3 original=texture2D(uImage,uv).rgb;
 float luminance=dot(original,vec3(.299,.587,.114));
 vec2 cell=uv*vec2(68.,90.);
 float lineX=1.-smoothstep(.015,.07,abs(fract(cell.x+luminance*1.8)-.5));
 float lineY=1.-smoothstep(.015,.07,abs(fract(cell.y+luminance*1.8)-.5));
 float diagonal=1.-smoothstep(.01,.045,abs(fract(cell.x+cell.y)-.5));
 float grid=max(max(lineX,lineY),diagonal*.4);
 float contours=1.-smoothstep(.02,.09,abs(fract(luminance*18.)-.5));
 vec3 digital=vec3(.055,.075,.068)+luminance*vec3(.28,.38,.30);
 digital+=grid*vec3(.35,.48,.38)*(.35+luminance)+contours*vec3(.20,.24,.17);
 vec2 delta=(vUv-uPointer)*vec2(aspect,1.);
 float lens=(1.-smoothstep(.15,.27,length(delta)))*uReveal;
 float mask=max(lens,uFull);
 vec3 color=mix(original,digital,mask);
 float ring=(1.-smoothstep(.001,.003,abs(length(delta)-.245)))*uReveal*(1.-uFull);
 color=mix(color,vec3(.93,.34,.23),ring*.8);
 gl_FragColor=vec4(color,1.);
 #include <colorspace_fragment>
}`;
function Surface({
  src,
  point,
  revealed,
  full,
}: {
  src: string;
  point: React.RefObject<{ x: number; y: number }>;
  revealed: boolean;
  full: boolean;
}) {
  const texture = useLoader(TextureLoader, src);
  const material = useRef<ShaderMaterial>(null);
  const { viewport, size, invalidate } = useThree();
  const target = useRef({ revealed, full });
  target.current = { revealed, full };
  const uniforms = useMemo(
    () => ({
      uImage: { value: texture },
      uPointer: { value: new Vector2(0.5, 0.5) },
      uResolution: { value: new Vector2(size.width, size.height) },
      uReveal: { value: 0 },
      uFull: { value: 0 },
      uImageAspect: { value: 1080 / 1440 },
    }),
    [texture, size.width, size.height],
  );
  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    const img = texture.image;
    uniforms.uImageAspect.value = img.width / img.height;
    invalidate();
  }, [texture, uniforms, invalidate]);
  useEffect(() => {
    invalidate();
  }, [revealed, full, invalidate]);
  useFrame((_, delta) => {
    if (!material.current) return;
    const u = material.current.uniforms;
    const a = 1 - Math.exp(-Math.min(delta, 0.05) * 12);
    const targetPoint = new Vector2(point.current.x, point.current.y);
    u.uPointer.value.lerp(targetPoint, a);
    u.uReveal.value += (Number(target.current.revealed) - u.uReveal.value) * a;
    u.uFull.value += (Number(target.current.full) - u.uFull.value) * a;
    if (
      u.uPointer.value.distanceTo(targetPoint) > 0.0001 ||
      Math.abs(u.uReveal.value - Number(target.current.revealed)) > 0.001 ||
      Math.abs(u.uFull.value - Number(target.current.full)) > 0.001
    )
      invalidate();
  });
  // Pointer events are dispatched by the DOM wrapper, including on transparent canvas.
  useEffect(() => {
    const frame = () => invalidate();
    window.addEventListener("portrait-move", frame);
    return () => window.removeEventListener("portrait-move", frame);
  }, [invalidate]);
  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
export default function PortraitScene(props: {
  src: string;
  point: React.RefObject<{ x: number; y: number }>;
  revealed: boolean;
  full: boolean;
  onFailure: () => void;
}) {
  return (
    <Canvas
      aria-hidden="true"
      frameloop="demand"
      dpr={[1, 1.25]}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 2], fov: 45 }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", props.onFailure, {
          once: true,
        });
      }}
    >
      <Suspense fallback={null}>
        <Surface {...props} />
      </Suspense>
    </Canvas>
  );
}
