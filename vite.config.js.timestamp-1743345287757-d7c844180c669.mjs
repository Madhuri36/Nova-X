// vite.config.js
import react from "file:///E:/Studying/Three%20js/%D0%BC%D0%BE%D0%B4%D1%83%D0%BB%D1%8C%206%20-%20React%20Three%20Fiber/66-create-a-game-with-r3f/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { transformWithEsbuild } from "file:///E:/Studying/Three%20js/%D0%BC%D0%BE%D0%B4%D1%83%D0%BB%D1%8C%206%20-%20React%20Three%20Fiber/66-create-a-game-with-r3f/node_modules/vite/dist/node/index.js";
import restart from "file:///E:/Studying/Three%20js/%D0%BC%D0%BE%D0%B4%D1%83%D0%BB%D1%8C%206%20-%20React%20Three%20Fiber/66-create-a-game-with-r3f/node_modules/vite-plugin-restart/dist/index.js";
import glsl from "file:///E:/Studying/Three%20js/%D0%BC%D0%BE%D0%B4%D1%83%D0%BB%D1%8C%206%20-%20React%20Three%20Fiber/66-create-a-game-with-r3f/node_modules/vite-plugin-glsl/src/index.js";
var vite_config_default = {
  root: "src/",
  publicDir: "../public/",
  plugins: [
    // Restart server on static/public file change
    restart({ restart: ["../public/**"] }),
    // React support
    react(),
    // GLSL support
    glsl(),
    // .js file support as if it was JSX
    {
      name: "load+transform-js-files-as-jsx",
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/))
          return null;
        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic"
        });
      }
    }
  ],
  server: {
    host: true,
    // Open to local network and display URL
    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env)
    // Open if it's not a CodeSandbox
  },
  build: {
    outDir: "../dist",
    // Output in the dist/ folder
    emptyOutDir: true,
    // Empty the folder first
    sourcemap: true
    // Add sourcemap
  }
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxTdHVkeWluZ1xcXFxUaHJlZSBqc1xcXFxcdTA0M0NcdTA0M0VcdTA0MzRcdTA0NDNcdTA0M0JcdTA0NEMgNiAtIFJlYWN0IFRocmVlIEZpYmVyXFxcXDY2LWNyZWF0ZS1hLWdhbWUtd2l0aC1yM2ZcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXFN0dWR5aW5nXFxcXFRocmVlIGpzXFxcXFx1MDQzQ1x1MDQzRVx1MDQzNFx1MDQ0M1x1MDQzQlx1MDQ0QyA2IC0gUmVhY3QgVGhyZWUgRmliZXJcXFxcNjYtY3JlYXRlLWEtZ2FtZS13aXRoLXIzZlxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovU3R1ZHlpbmcvVGhyZWUlMjBqcy8lRDAlQkMlRDAlQkUlRDAlQjQlRDElODMlRDAlQkIlRDElOEMlMjA2JTIwLSUyMFJlYWN0JTIwVGhyZWUlMjBGaWJlci82Ni1jcmVhdGUtYS1nYW1lLXdpdGgtcjNmL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgeyB0cmFuc2Zvcm1XaXRoRXNidWlsZCB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCByZXN0YXJ0IGZyb20gJ3ZpdGUtcGx1Z2luLXJlc3RhcnQnXHJcbmltcG9ydCBnbHNsIGZyb20gJ3ZpdGUtcGx1Z2luLWdsc2wnXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICByb290OiAnc3JjLycsXHJcbiAgICBwdWJsaWNEaXI6ICcuLi9wdWJsaWMvJyxcclxuICAgIHBsdWdpbnM6XHJcbiAgICBbXHJcbiAgICAgICAgLy8gUmVzdGFydCBzZXJ2ZXIgb24gc3RhdGljL3B1YmxpYyBmaWxlIGNoYW5nZVxyXG4gICAgICAgIHJlc3RhcnQoeyByZXN0YXJ0OiBbICcuLi9wdWJsaWMvKionLCBdIH0pLFxyXG5cclxuICAgICAgICAvLyBSZWFjdCBzdXBwb3J0XHJcbiAgICAgICAgcmVhY3QoKSxcclxuXHJcbiAgICAgICAgIC8vIEdMU0wgc3VwcG9ydFxyXG4gICAgICAgICBnbHNsKCksXHJcblxyXG5cclxuICAgICAgICAvLyAuanMgZmlsZSBzdXBwb3J0IGFzIGlmIGl0IHdhcyBKU1hcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdsb2FkK3RyYW5zZm9ybS1qcy1maWxlcy1hcy1qc3gnLFxyXG4gICAgICAgICAgICBhc3luYyB0cmFuc2Zvcm0oY29kZSwgaWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICghaWQubWF0Y2goL3NyY1xcLy4qXFwuanMkLykpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNmb3JtV2l0aEVzYnVpbGQoY29kZSwgaWQsIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2FkZXI6ICdqc3gnLFxyXG4gICAgICAgICAgICAgICAgICAgIGpzeDogJ2F1dG9tYXRpYycsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgXSxcclxuICAgIHNlcnZlcjpcclxuICAgIHtcclxuICAgICAgICBob3N0OiB0cnVlLCAvLyBPcGVuIHRvIGxvY2FsIG5ldHdvcmsgYW5kIGRpc3BsYXkgVVJMXHJcbiAgICAgICAgb3BlbjogISgnU0FOREJPWF9VUkwnIGluIHByb2Nlc3MuZW52IHx8ICdDT0RFU0FOREJPWF9IT1NUJyBpbiBwcm9jZXNzLmVudikgLy8gT3BlbiBpZiBpdCdzIG5vdCBhIENvZGVTYW5kYm94XHJcbiAgICB9LFxyXG4gICAgYnVpbGQ6XHJcbiAgICB7XHJcbiAgICAgICAgb3V0RGlyOiAnLi4vZGlzdCcsIC8vIE91dHB1dCBpbiB0aGUgZGlzdC8gZm9sZGVyXHJcbiAgICAgICAgZW1wdHlPdXREaXI6IHRydWUsIC8vIEVtcHR5IHRoZSBmb2xkZXIgZmlyc3RcclxuICAgICAgICBzb3VyY2VtYXA6IHRydWUgLy8gQWRkIHNvdXJjZW1hcFxyXG4gICAgfSxcclxufSJdLAogICJtYXBwaW5ncyI6ICI7QUFBdWMsT0FBTyxXQUFXO0FBQ3pkLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sYUFBYTtBQUNwQixPQUFPLFVBQVU7QUFFakIsSUFBTyxzQkFBUTtBQUFBLEVBQ1gsTUFBTTtBQUFBLEVBQ04sV0FBVztBQUFBLEVBQ1gsU0FDQTtBQUFBO0FBQUEsSUFFSSxRQUFRLEVBQUUsU0FBUyxDQUFFLGNBQWdCLEVBQUUsQ0FBQztBQUFBO0FBQUEsSUFHeEMsTUFBTTtBQUFBO0FBQUEsSUFHTCxLQUFLO0FBQUE7QUFBQSxJQUlOO0FBQUEsTUFDSSxNQUFNO0FBQUEsTUFDTixNQUFNLFVBQVUsTUFBTSxJQUN0QjtBQUNJLFlBQUksQ0FBQyxHQUFHLE1BQU0sY0FBYztBQUN4QixpQkFBTztBQUVYLGVBQU8scUJBQXFCLE1BQU0sSUFBSTtBQUFBLFVBQ2xDLFFBQVE7QUFBQSxVQUNSLEtBQUs7QUFBQSxRQUNULENBQUM7QUFBQSxNQUNMO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFBQSxFQUNBLFFBQ0E7QUFBQSxJQUNJLE1BQU07QUFBQTtBQUFBLElBQ04sTUFBTSxFQUFFLGlCQUFpQixRQUFRLE9BQU8sc0JBQXNCLFFBQVE7QUFBQTtBQUFBLEVBQzFFO0FBQUEsRUFDQSxPQUNBO0FBQUEsSUFDSSxRQUFRO0FBQUE7QUFBQSxJQUNSLGFBQWE7QUFBQTtBQUFBLElBQ2IsV0FBVztBQUFBO0FBQUEsRUFDZjtBQUNKOyIsCiAgIm5hbWVzIjogW10KfQo=
