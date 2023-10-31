(function(window){
    if(typeof exports !== "undefined" && typeof require === "function") {
        exports.string = require("./JStrings");
        exports.math = require("./JMath");
        exports.engineering = require("./Engineering");
        exports.objects = require("./JObjects")
    }
    window.jango = window.jango || {};
    const SCRIPTS_PATH = "https://kingjango13.github.io/JangoJS";
    async function importScript(name) {
        return import(`https://kingjango13.github.io/JangoJS/${name}.js`);
    }
    (async function(){
        await importScript("JStrings");
        await importScript("JMath");
        await importScript("Engineering");
        await importScript("JObjects");
    })().catch(function(error) {
        throw error;
    });
})(this || globalThis);