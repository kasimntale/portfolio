import { fragmentShader, vertexShader } from "./shaders";
import {
  matrixProfiles,
  portraitCover,
  type MatrixQuality,
} from "@/lib/matrix-timeline";
export type MatrixRenderer = {
  draw: (time: number, blend: number) => void;
  resize: () => void;
  dispose: () => void;
  kind: "webgl" | "canvas";
};
export function createWebGLRenderer(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  quality: MatrixQuality,
  position: string,
  zoom: number,
): MatrixRenderer {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    powerPreference: "low-power",
  });
  if (!gl) throw new Error("WebGL unavailable");
  const shaders: WebGLShader[] = [];
  const textures: WebGLTexture[] = [];
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  const dispose = () => {
    textures.forEach((t) => gl.deleteTexture(t));
    shaders.forEach((s) => gl.deleteShader(s));
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
  };
  try {
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Shader allocation failed");
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error("Shader compilation failed");
      return shader;
    };
    program = gl.createProgram();
    if (!program) throw new Error("Program allocation failed");
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error("Shader link failed");
    gl.useProgram(program);
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const attribute = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
    const atlas = document.createElement("canvas");
    atlas.width = 64;
    atlas.height = 40;
    const context = atlas.getContext("2d");
    if (!context) throw new Error("Glyph atlas unavailable");
    context.fillStyle = "#000";
    context.fillRect(0, 0, 64, 40);
    context.fillStyle = "#fff";
    context.font = "28px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("0", 16, 21);
    context.fillText("1", 48, 21);
    const texture = (source: TexImageSource, unit: number, name: string) => {
      const result = gl.createTexture();
      if (!result) throw new Error("Texture allocation failed");
      textures.push(result);
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, result);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        source,
      );
      gl.uniform1i(gl.getUniformLocation(program!, name), unit);
    };
    texture(image, 0, "uPortrait");
    texture(atlas, 1, "uGlyphs");
    const timeLocation = gl.getUniformLocation(program, "uTime"),
      blendLocation = gl.getUniformLocation(program, "uBlend");
    const profile = matrixProfiles[quality];
    gl.uniform2f(
      gl.getUniformLocation(program, "uGrid"),
      profile.columns,
      profile.rows,
    );
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const resolution = Math.min(
        devicePixelRatio || 1,
        profile.dpr,
        profile.maxWidth / Math.max(bounds.width, 1),
      );
      canvas.width = Math.max(1, Math.round(bounds.width * resolution));
      canvas.height = Math.max(1, Math.round(bounds.height * resolution));
      gl.viewport(0, 0, canvas.width, canvas.height);
      const cover = portraitCover(
        bounds.width,
        bounds.height,
        image.width,
        image.height,
        position,
        zoom,
      );
      gl.uniform2f(
        gl.getUniformLocation(program!, "uOffset"),
        cover.x / bounds.width,
        cover.y / bounds.height,
      );
      gl.uniform2f(
        gl.getUniformLocation(program!, "uScale"),
        cover.width / bounds.width,
        cover.height / bounds.height,
      );
    };
    resize();
    return {
      kind: "webgl",
      resize,
      dispose,
      draw: (time, blend) => {
        gl.uniform1f(timeLocation, time);
        gl.uniform1f(blendLocation, blend);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      },
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
export function createCanvasRenderer(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  quality: MatrixQuality,
  position: string,
  zoom: number,
): MatrixRenderer {
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Canvas unavailable");
  const sample = document.createElement("canvas");
  const columns = quality === "high" ? 60 : 44,
    rows = quality === "high" ? 86 : 64;
  sample.width = columns;
  sample.height = rows;
  const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
  if (!sampleCtx) throw new Error("Sampling unavailable");
  let pixels: Uint8ClampedArray;
  let cover = portraitCover(1, 1, image.width, image.height, position, zoom);
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(Math.min(rect.width, 480)));
    canvas.height = Math.max(
      1,
      Math.round((canvas.width * rect.height) / Math.max(rect.width, 1)),
    );
    cover = portraitCover(
      canvas.width,
      canvas.height,
      image.width,
      image.height,
      position,
      zoom,
    );
    const s = portraitCover(
      columns,
      rows,
      image.width,
      image.height,
      position,
      zoom,
    );
    sampleCtx.drawImage(image, s.x, s.y, s.width, s.height);
    pixels = sampleCtx.getImageData(0, 0, columns, rows).data;
  };
  resize();
  const hash = (n: number) => {
    const x = Math.sin(n * 127.1) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    kind: "canvas",
    resize,
    dispose: () => {
      sample.width = sample.height = 1;
      canvas.width = canvas.height = 1;
    },
    draw: (time, blend) => {
      const w = canvas.width,
        h = canvas.height,
        cw = w / columns,
        ch = h / rows;
      ctx.globalAlpha = 1;
      ctx.drawImage(image, cover.x, cover.y, cover.width, cover.height);
      ctx.font = `${Math.ceil(ch * 0.95)}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (blend <= 0) return;
      for (let row = 0; row < rows; row++)
        for (let col = 0; col < columns; col++) {
          const x = (col + 0.5) * cw,
            y = (row + 0.5) * ch;
          const uvx = (x - cover.x) / cover.width,
            uvy = (y - cover.y) / cover.height;
          const head =
            1 -
            Math.min(
              1,
              Math.max(
                0,
                (Math.hypot((uvx - 0.5) / 0.31, (uvy - 0.43) / 0.37) - 0.88) /
                  0.2,
              ),
            );
          const shoulder =
            (uvy > 0.69 ? 1 : 0) *
            (1 -
              Math.min(
                1,
                Math.max(
                  0,
                  (Math.hypot((uvx - 0.5) / 0.65, (uvy - 1.07) / 0.39) - 0.88) /
                    0.2,
                ),
              ));
          const mask = Math.max(head, shoulder);
          const field =
            (1 - uvy) * 0.74 +
            hash(col * 19 + row * 25) * 0.14 +
            Math.sin(uvx * 17 + uvy * 12) * 0.04;
          const a = Math.max(
            0,
            Math.min(1, (blend * 1.4 - 0.2 - field + 0.13) / 0.26),
          );
          const mix = a * a * (3 - 2 * a);
          if (mix === 0) continue;
          ctx.globalAlpha = mix;
          ctx.fillStyle = "#020503";
          ctx.fillRect(col * cw, row * ch, cw + 1, ch + 1);
          const i = (row * columns + col) * 4;
          const lum =
            (pixels[i] * 0.2126 +
              pixels[i + 1] * 0.7152 +
              pixels[i + 2] * 0.0722) /
            255;
          const speed = 1.4 + hash(col + 3) * 2.5;
          const trail =
            0.45 +
            0.55 *
              Math.pow(
                0.5 + 0.5 * Math.sin(row * 0.29 - time * speed * 0.34 + col),
                3,
              );
          const bright =
            Math.min(1, Math.pow(lum, 0.6) * 1.4) * (0.7 + 0.3 * trail) * mask;
          if (bright < 0.025) continue;
          ctx.fillStyle = `rgb(${Math.round(bright * 94)},${Math.round(bright * 242)},${Math.round(bright * 145)})`;
          const offset = (time * speed) % 1;
          ctx.fillText(
            hash(col * 73 + Math.floor(row - time * speed)) > 0.5 ? "1" : "0",
            x,
            y + offset * ch,
          );
        }
      ctx.globalAlpha = 1;
    },
  };
}
