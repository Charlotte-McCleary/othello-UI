To generate the files in this directory, I first wrote the function contained in add.c. 
After that, I compiled this to WebAssembly using the command

    emcc add.c -o add.html -sEXPORTED_FUNCTIONS=_add -sEXPORTED_RUNTIME_METHODS=ccall,cwrap

(you have to have emscripten installed to do this; you can simply do 'sudo apt install emscripten' from WSL).
After executing this command, the files add.wasm, add.js, and add.html are generated. The add.wasm file contains the compiled C function (the WebAssembly).
The add.js file acts as a wrapper for the add.wasm file. The add.html file is a way to view the standard output of a wasm file (we won't be using this). 
I then created the file index.html, using the method 'cwrap' to wrap the compiled C function. 
You can then test this file by executing the following command

    python3 -m http.server 8080

and then visiting the URL http://localhost:8080 in your browser.
