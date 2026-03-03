import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";
import styles from "./Galaxy.module.css";

export default function Galaxy({
  focal = [0.5, 0.5],
  rotation = [1.0, 0.0],
  starSpeed = 0.02, // Sokin harakat uchun pasaytirildi
  density = 0.7, // Yulduzlar zichligi kamaytirildi
  hueShift = 220, // Tinchlantiruvchi moviy rang
  disableAnimation = false,
  speed = 0.3, // Umumiy tezlik sekinlashtirildi
  mouseInteraction = true,
  glowIntensity = 0.2, // Yulduz yorqinligi pasaytirildi
  saturation = 0.3,
  mouseRepulsion = true,
  repulsionStrength = 2,
  twinkleIntensity = 0.2,
  rotationSpeed = 0.05, // Aylanish deyarli sezilmaydi
  autoCenterRepulsion = 0,
  transparent = true,
  ...rest
}) {
  const ctnDom = useRef(null);
  const targetMousePos = useRef({ x: 0.5, y: 0.5 });
  const smoothMousePos = useRef({ x: 0.5, y: 0.5 });
  const targetMouseActive = useRef(0.0);
  const smoothMouseActive = useRef(0.0);

  const vertexShader = `
    attribute vec2 uv;
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0, 1);
    }
  `;

  const fragmentShader = `
    precision highp float;
    uniform float uTime;
    uniform vec3 uResolution;
    uniform vec2 uFocal;
    uniform float uDensity;
    uniform float uHueShift;
    uniform float uSpeed;
    uniform vec2 uMouse;
    uniform float uGlowIntensity;
    uniform float uSaturation;
    uniform bool uMouseRepulsion;
    uniform float uRotationSpeed;
    uniform float uMouseActiveFactor;
    uniform bool uTransparent;
    varying vec2 vUv;

    #define NUM_LAYER 5.0

    float Hash21(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    float Star(vec2 uv, float flare) {
      float d = length(uv);
      // Yorqinlikni juda yumshoq qildik
      float m = (0.02 * uGlowIntensity) / d; 
      float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 500.0));
      m += rays * flare * 0.1 * uGlowIntensity;
      m *= smoothstep(0.8, 0.2, d);
      return m;
    }

    void main() {
      vec2 focalPx = uFocal * uResolution.xy;
      vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;
      
      float t = uTime * uSpeed;
      
      // Sichqoncha harakati (yumshoq)
      vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
      if(uMouseRepulsion) {
         uv -= mousePosUV * 0.05 * uMouseActiveFactor;
      }

      // Sokin aylanish
      float angle = t * uRotationSpeed;
      mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      uv *= rot;

      vec3 col = vec3(0.0);

      for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
        float depth = fract(i + t * 0.05); 
        float scale = mix(15.0, 0.8, depth) * uDensity;
        float fade = depth * smoothstep(1.0, 0.8, depth);
        
        vec2 gv = fract(uv * scale + i * 453.2) - 0.5;
        vec2 id = floor(uv * scale + i * 453.2);
        float seed = Hash21(id);
        
        // Ranglar (ko'proq moviy va oq)
        vec3 color = hsv2rgb(vec3(fract(uHueShift/360.0 + seed*0.05), uSaturation, 1.0));
        
        float star = Star(gv, smoothstep(0.9, 1.0, seed));
        col += star * fade * color;
      }

      if (uTransparent) {
        gl_FragColor = vec4(col, min(length(col), 1.0));
      } else {
        gl_FragColor = vec4(col, 1.0);
      }
    }
  `;

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;
    const renderer = new Renderer({
      alpha: transparent,
      premultipliedAlpha: false,
    });
    const gl = renderer.gl;

    function resize() {
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      if (program) {
        program.uniforms.uResolution.value = new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height,
        );
      }
    }

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new Color(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height,
          ),
        },
        uFocal: { value: new Float32Array(focal) },
        uStarSpeed: { value: starSpeed },
        uDensity: { value: density },
        uHueShift: { value: hueShift },
        uSpeed: { value: speed },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uGlowIntensity: { value: glowIntensity },
        uSaturation: { value: saturation },
        uMouseRepulsion: { value: mouseRepulsion },
        uRotationSpeed: { value: rotationSpeed },
        uMouseActiveFactor: { value: 0.0 },
        uTransparent: { value: transparent },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    let animateId;

    function update(t) {
      animateId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;

      // Mouse smoothing
      const lerpFactor = 0.05;
      smoothMouseActive.current +=
        (targetMouseActive.current - smoothMouseActive.current) * lerpFactor;
      program.uniforms.uMouseActiveFactor.value = smoothMouseActive.current;

      renderer.render({ scene: mesh });
    }

    animateId = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    const handleMouseMove = (e) => {
      const rect = ctn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      program.uniforms.uMouse.value[0] = x;
      program.uniforms.uMouse.value[1] = y;
      targetMouseActive.current = 1.0;
    };

    const handleMouseLeave = () => {
      targetMouseActive.current = 0.0;
    };

    if (mouseInteraction) {
      window.addEventListener("mousemove", handleMouseMove);
      ctn.addEventListener("mouseleave", handleMouseLeave);
    }

    window.addEventListener("resize", resize);
    resize();

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      ctn.removeEventListener("mouseleave", handleMouseLeave);
      ctn.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [density, starSpeed, hueShift, transparent]);

  return <div ref={ctnDom} className={styles.galaxyContainer} {...rest} />;
}
