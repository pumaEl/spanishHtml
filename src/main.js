import diccionario from "./dictionary.js";
import { cssProps } from "./AllCssProps.js";
function splitArgs(str) {
    let result = [];
    let current = "";
    let depth = 0;
    for (const char of str) {
        if (char === "(") depth++;
        if (char === ")") depth--;
        if (char === "," && depth === 0) {
            result.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }
    if (current) result.push(current.trim());
    return result;
}
function translateBorder(value) {
    return value
        .trim()
        .split(/\s+/)
        .map(part => {
            if (/[a-z]/i.test(part)) {
                return translate(part);
            }
            return part;
        })
        .join(" ");
}
function translateStop(stop) {
    const parts = stop.trim().split(/\s+/);
    // nada que traducir
    if (parts.length === 0) return stop;
    // SOLO traducimos la primera parte (color)
    parts[0] = translate(parts[0]);
    return parts.join(" ");
}
function translate(value) {
    if (!value) return value;
    value = value.trim();
    // HEX
    if (value.startsWith("#")) return value;
    // static value
    if (/\d+(\.\d+)?([a-z]{2,3}|%)$/i.test(value)) {
        return value;
    }
    // Detectar función CSS
    const fnMatch = value.match(/^([a-z-]+)\((.*)\)$/i);
    if (fnMatch) {
        const [, fnName, fnArgs] = fnMatch;
        // Traducir nombre de la función
        const translatedFn =
            diccionario[fnName.toLowerCase()] || fnName;
        // Separar argumentos sin romper funciones anidadas
        const args = splitArgs(fnArgs).map(arg => translateStop(arg));
        return `${translatedFn}(${args.join(", ")})`;
    }
    const brMatch = value.match(/([0-9])([a-z]{2,3}|%)(.*)/g);
    if (brMatch){
        const vals = translateBorder(value);
        return vals;
    }
    // Valor simple (color)
    return diccionario[value.toLowerCase()] || value;
}
function parseTags(){
    var h1s = document.querySelectorAll("titulo1");
    var h2s = document.querySelectorAll("titulo2");
    var h3s = document.querySelectorAll("titulo3");
    var h4s = document.querySelectorAll("titulo4");
    var h5s = document.querySelectorAll("titulo5");
    var h6s = document.querySelectorAll("titulo6");
    var ps = document.querySelectorAll("texto");
ps.forEach((element) => {
    
});
}
const map = Object.fromEntries(
  Object.entries(cssProps).map(([attr, cssProp]) => [
    attr,
    el => el.style[attr] = translate(el.getAttribute(attr))
  ])
);
const reverseMap = Object.fromEntries(
  Object.entries(cssProps).map(([englishProp, spanishName]) => [
    spanishName,
    englishProp
  ])
);
function parseAttr() {
  document.querySelectorAll("*").forEach(el => {
    Object.keys(reverseMap).forEach(spanishAttr => {
      if (el.hasAttribute(spanishAttr)) {
        const englishProp = reverseMap[spanishAttr];
        const value = el.getAttribute(spanishAttr);
        const translatedValue = translate(value);
        el.style[englishProp] = translatedValue;
      }
    });
  });
}
parseAttr();
parseTags();