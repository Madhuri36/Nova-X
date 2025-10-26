#define PI 3.14159
// #include <fog_pars_vertex>
varying vec2 vUv;
varying float vFogDepth;

void main() {
    // #include <begin_vertex>
    // #include <project_vertex>
    // #include <fog_vertex>

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    vUv = uv;
    vFogDepth = -viewPosition.z;
}