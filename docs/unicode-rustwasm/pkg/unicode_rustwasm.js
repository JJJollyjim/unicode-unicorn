(function() {
    const __exports = {};
    let wasm;

    let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

    cachedTextDecoder.decode();

    let cachegetUint8Memory0 = null;
    function getUint8Memory0() {
        if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
            cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
        }
        return cachegetUint8Memory0;
    }

    function getStringFromWasm0(ptr, len) {
        return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
    }
    /**
    */
    __exports.greet = function() {
        wasm.greet();
    };

    /**
    * @param {number} codepoint
    * @returns {number}
    */
    __exports.next_codepoint = function(codepoint) {
        var ret = wasm.next_codepoint(codepoint);
        return ret >>> 0;
    };

    /**
    * @param {number} codepoint
    * @returns {number}
    */
    __exports.previous_codepoint = function(codepoint) {
        var ret = wasm.previous_codepoint(codepoint);
        return ret >>> 0;
    };

    function init(module) {
        if (typeof module === 'undefined') {
            let src;
            if (self.document === undefined) {
                src = self.location.href;
            } else {
                src = self.document.currentScript.src;
            }
            module = src.replace(/\.js$/, '_bg.wasm');
        }
        let result;
        const imports = {};
        imports.wbg = {};
        imports.wbg.__wbg_alert_bccdc5291f67a4ef = function(arg0, arg1) {
            alert(getStringFromWasm0(arg0, arg1));
        };

        if ((typeof URL === 'function' && module instanceof URL) || typeof module === 'string' || (typeof Request === 'function' && module instanceof Request)) {

            const response = fetch(module);
            if (typeof WebAssembly.instantiateStreaming === 'function') {
                result = WebAssembly.instantiateStreaming(response, imports)
                .catch(e => {
                    return response
                    .then(r => {
                        if (r.headers.get('Content-Type') != 'application/wasm') {
                            console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
                            return r.arrayBuffer();
                        } else {
                            throw e;
                        }
                    })
                    .then(bytes => WebAssembly.instantiate(bytes, imports));
                });
            } else {
                result = response
                .then(r => r.arrayBuffer())
                .then(bytes => WebAssembly.instantiate(bytes, imports));
            }
        } else {

            result = WebAssembly.instantiate(module, imports)
            .then(result => {
                if (result instanceof WebAssembly.Instance) {
                    return { instance: result, module };
                } else {
                    return result;
                }
            });
        }
        return result.then(({instance, module}) => {
            wasm = instance.exports;
            init.__wbindgen_wasm_module = module;

            return wasm;
        });
    }

    self.wasm_bindgen = Object.assign(init, __exports);

})();
