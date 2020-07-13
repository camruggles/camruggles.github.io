"use strict";

var vertexShaderSource = `#version 300 es
    in vec4 vPosition;

    void main()
    {
        gl_Position = vPosition;
        gl_PointSize = 0.25;
    }
`;

var fragmentShaderSource = `#version 300 es
    precision highp float;
    out vec4 outColor;

    void main()
    {
        outColor = vec4( 0.0, 1.0, 0.5, 1.0 );
    }
`;


function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

var numPoints =  10000000;



function main(){
    var canvas = document.querySelector("#c");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
      return;
    }

    //
    // var points = new Float32Array([
    //     0.33, 0.33,
    //     -0.33, -0.33,
    //     0.33, -0.33,
    //     0.25, 0.25,
    //     -0.25, 0.25,
    //     0.25, -0.25
    //
    // ]);
    var vertices = [-1.0, -1.0,
        0.0, 1.0, 1.0, -1.0];
    var points = new Float32Array(2*numPoints);
    points[0] = 0.25;
    points[1] = 0.5;
    var i;
    for (i = 1; i < numPoints; ++i){
        var j = getRandomInt(3);
        // console.log("top");
        // console.log(j);
        // console.log(points[2*(i-1)]);
        // console.log(vertices[2*j]);
        var p1 = (points[2*(i-1)] + vertices[2*j]) / 2.0;
        var p2 = (points[2*(i-1)+1] + vertices[2*j+1]) / 2.0;
        // console.log(j);
        // console.log(p1);
        // console.log(p2);
        points[2*i] = p1;
        points[2*i+1] = p2;
    }

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    console.log(vertexShader);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    console.log(fragmentShader);
    var program = createProgram(gl, vertexShader, fragmentShader);
    console.log(program);
    gl.useProgram(program);



    var loc = gl.getAttribLocation(program, "vPosition");

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    // gl.clearColor(1.0, 1.0, 1.0, 1.0);


             // Clear the canvas
             gl.clearColor(0.0, 0.0, 0.0, 1.0);

             // Enable the depth test
             gl.enable(gl.DEPTH_TEST);

             // Clear the color buffer bit
             gl.clear(gl.COLOR_BUFFER_BIT);

             // Set the view port
             gl.viewport(0,0,canvas.width,canvas.height);

    // gl.viewport(0,0,canvas.width,canvas.height);
    console.log(points);
    console.log(numPoints);
    console.log(gl.drawArrays(gl.POINTS, 0, numPoints));
    console.log("arrays drawn")
    gl.Flush();


}

main()
