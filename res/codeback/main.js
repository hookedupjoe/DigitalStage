const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (code) {
    sessionStorage.setItem('codebackcode', code);
    window.location = '/' 
}


