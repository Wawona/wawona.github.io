const RippleOverlay = (() => {
    let cvs, gl, prg, vao, uPos, uRes, uAmp, uPrg, active = false, start = 0, dur = 800, rAF;

    const VERT = `#version 300 es\nin vec2 p;void main(){gl_Position=vec4(p,0,1);}`;
    const FRAG = `#version 300 es\nprecision highp float;uniform vec2 c,r;uniform float a,p;out vec4 f;void main(){` +
        `float d=length(gl_FragCoord.xy-c),mx=length(r),rad=p*mx*1.1,w=80.0,g=smoothstep(rad-w,rad,d)*smoothstep(rad+w,rad,d);` +
        `f=vec4(1,1,1,g*a*(1.0-p*0.5)*0.4);}`;

    function init() {
        if (gl) return 1;
        cvs = document.createElement('canvas');
        cvs.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:99999;display:none;';
        document.body.appendChild(cvs);
        gl = cvs.getContext('webgl2', { alpha: 1 });
        if (!gl) return;

        const compile = (s, t) => {
            const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh);
            return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
        };
        const vs = compile(VERT, gl.VERTEX_SHADER), fs = compile(FRAG, gl.FRAGMENT_SHADER);
        prg = gl.createProgram(); gl.attachShader(prg, vs); gl.attachShader(prg, fs); gl.linkProgram(prg);

        gl.useProgram(prg);
        vao = gl.createVertexArray(); gl.bindVertexArray(vao);
        const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
        const l = gl.getAttribLocation(prg, 'p'); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, 2, gl.FLOAT, 0, 0, 0);

        uPos = gl.getUniformLocation(prg, 'c'); uRes = gl.getUniformLocation(prg, 'r');
        uAmp = gl.getUniformLocation(prg, 'a'); uPrg = gl.getUniformLocation(prg, 'p');
        return 1;
    }

    function frame(ts) {
        if (!active) return;
        const elapsed = (ts - start) / dur, p = Math.min(elapsed, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(uPos, center[0] * dp, (innerHeight - center[1]) * dp);
        gl.uniform2f(uRes, cvs.width, cvs.height);
        gl.uniform1f(uAmp, p > .7 ? 1 - (p - .7) / .3 : 1);
        gl.uniform1f(uPrg, p);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        if (p >= 1) { active = false; cvs.style.display = 'none'; return; }
        rAF = requestAnimationFrame(frame);
    }

    let center = [0, 0], dp = 1;
    return {
        get available() { return !!init(); },
        trigger(x, y, d) {
            if (!this.available) return;
            cancelAnimationFrame(rAF);
            center = [x, y]; dur = d || 800; active = true; start = performance.now();
            dp = devicePixelRatio || 1; cvs.width = innerWidth * dp; cvs.height = innerHeight * dp;
            gl.viewport(0, 0, cvs.width, cvs.height);
            cvs.style.display = 'block';
            rAF = requestAnimationFrame(frame);
        }
    };
})();
