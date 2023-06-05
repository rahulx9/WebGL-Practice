const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("WebGL not supported");
}

// create vertex data.
const vertexData = [0, 1, 0, 1, -1, 0, -1, -1, 0];

const colorData = [1, 0, 0, 0, 1, 0, 0, 0, 1];

// create buffer.
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

// create vertex shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(
  vertexShader,
  `
  precision mediump float;

  attribute vec3 position;
  attribute vec3 color;
  varying vec3 vColor;

  uniform mat4 matrix;

  void main() {
    vColor = color;
    gl_Position = matrix * vec4(position, 1);
  }
`
);
gl.compileShader(vertexShader);

// create Fragment Shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(
  fragmentShader,
  `
  precision mediump float;
  varying vec3 vColor;

  void main() {
    gl_FragColor = vec4(vColor , 1);
  }
`
);
gl.compileShader(fragmentShader);

// Create Program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, "color");
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

const uniformLocations = {
  matrix: gl.getUniformLocation(program, "matrix"),
};

const matrix = mat4.create();
mat4.translate(matrix, matrix, [0.2, 0.5, 0]);
mat4.scale(matrix, matrix, [0.5, 0.5, 0.5]);

(function animate() {
  requestAnimationFrame(animate)
  mat4.rotateZ(matrix, matrix, Math.PI / 2/70);
  gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
})();
