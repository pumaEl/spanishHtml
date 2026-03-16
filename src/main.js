import tags from "./htmlTags.js";
import diccionario from "./dictionary.js";
import htmlAttrs from "./htmlAttr.js";
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
function translateStop(stop) {
    const parts = stop.trim().split(/\s+/);
    // nada que traducir
    if (parts.length === 0) return stop;
    // SOLO traducimos la primera parte (color)
    parts[0] = translate(parts[0]);
    return parts.join(" ");
}
function translateMedia(condition) {
    return condition.replace(/(\w+)(?=\s*:)/g, match => diccionario[match.toLowerCase()] || match);
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
    // Traducir palabras individuales (incluye palabras con guiones como "borde-caja")
    value = value.replace(/([a-zA-Z][a-zA-Z0-9-]*)/g, match => {
        const lower = match.toLowerCase();
        return diccionario[lower] || match;
    });
    return value;
}

function translateSelector(selector) {
    return selector.replace(/:([a-z-]+)/g, (match, pseudo) => {
        const translated = diccionario[pseudo.toLowerCase()] || pseudo;
        return `:${translated}`;
    });
}

function translateCSS(css) {

  // traducir @media
  css = css.replace(/@media\s*\(([^)]+)\)/gi, (match, cond) => {
    return `@media (${translateMedia(cond)})`;
  });

  // traducir selectores pseudo
  css = css.replace(/:([a-z-]+)/gi, (m, pseudo) => {
    return ":" + (diccionario[pseudo] || pseudo);
  });

  // traducir propiedades
  css = css.replace(/([a-zA-Z-]+)\s*:/g, (match, prop) => {

    const lower = prop.toLowerCase();

    if (reverseMap[lower]) {
      return reverseMap[lower] + ":";
    }

    const translated = translate(prop);

    if (translated !== prop) {
      const kebab = translated
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .toLowerCase();

      return kebab + ":";
    }

    return match;
  });

  // traducir valores
  css = css.replace(/:\s*([^;}{]+)/g, (match, value) => {
    return ": " + translate(value.trim());
  });

  return css;
}
const map = Object.fromEntries(
  Object.entries(cssProps).map(([attr, cssProp]) => [
    attr,
    el => el.style[attr] = translate(el.getAttribute(attr))
  ])
);
const reverseMap = Object.fromEntries(
  Object.entries(cssProps).map(([englishProp, spanishName]) => [
    spanishName.toLowerCase(),
    englishProp
  ])
);
function translateAttr(name) {
  // Translate only Spanish attribute names to English equivalents
  return htmlAttrs[name] || name;
}

function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

function parseAttr() {
  document.querySelectorAll("*").forEach(el => {
    // copy attributes into array so we can modify while iterating
    Array.from(el.attributes).forEach(attr => {
      const name = attr.name;
      if (htmlAttrs[name]) {
        const newName = translateAttr(name);
        if (newName !== name) {
          el.setAttribute(newName, attr.value);
          el.removeAttribute(name);
        }
      } else if (reverseMap[name]) {
        const englishProp = reverseMap[name];
        const value = attr.value;
        const translatedValue = translate(value);
        el.style[kebabToCamel(englishProp)] = translatedValue;
        el.removeAttribute(name);
      }
    });
  });
}
function parseEstilos() {
    document.querySelectorAll('style').forEach(styleEl => {
        styleEl.textContent = translateCSS(styleEl.textContent);
    });
}
function parseTags() {
  Object.entries(tags).forEach(([es, en]) => {
    const elements = document.querySelectorAll(es)
    elements.forEach(el => {
      const nuevo = document.createElement(en)
      for (let attr of el.attributes) {
        nuevo.setAttribute(attr.name, attr.value)
      }
      nuevo.innerHTML = el.innerHTML
      el.replaceWith(nuevo)
    })
  })
}
parseTags();
parseEstilos();
parseAttr();