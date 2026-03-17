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
    // traducimos todos los tokens del stop (color + posiciones)
    return parts.map(part => translate(part)).join(" ");
}
function translateMedia(condition) {
    return condition.replace(/([a-z-]+)(?=\s*:)/gi, match => diccionario[match.toLowerCase()] || match);
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
    // Proteger custom properties (--mi-variable)
    const customProps = [];
    value = value.replace(/--[a-zA-Z0-9-]+/g, match => {
        customProps.push(match);
        return `__CUSTOM_PROP_${customProps.length - 1}__`;
    });
    const restoreCustomProps = str =>
        str.replace(/__CUSTOM_PROP_(\d+)__/g, (_, i) => {
            const restored = customProps[Number(i)];
            return restored || `__CUSTOM_PROP_${i}__`;
        });
    // Detectar función CSS
    const fnMatch = value.match(/^([a-z-]+)\((.*)\)$/i);
    if (fnMatch) {
        const [, fnName, fnArgs] = fnMatch;
        // Traducir nombre de la función
        const translatedFn =
            diccionario[fnName.toLowerCase()] || fnName;
        // Separar argumentos sin romper funciones anidadas
        const args = splitArgs(fnArgs).map(arg => translate(arg));
        const translated = `${translatedFn}(${args.join(", ")})`;
        return restoreCustomProps(translated);
    }
    // Traducir palabras individuales (incluye palabras con guiones como "borde-caja")
    value = value.replace(/([a-zA-Z][a-zA-Z0-9-]*)/g, match => {
        const lower = match.toLowerCase();
        if (reverseMap && reverseMap[lower]) return reverseMap[lower];
        return diccionario[lower] || match;
    });
    return restoreCustomProps(value);
}

function translateSelector(selector) {
    return selector.replace(/:([a-z-]+)/g, (match, pseudo) => {
        const translated = diccionario[pseudo.toLowerCase()] || pseudo;
        return `:${translated}`;
    });
}

function translateAtRules(text) {
  return text.replace(/@([a-z-]+)/gi, (match, name) => {
    const translated = diccionario[name.toLowerCase()] || name;
    return `@${translated}`;
  });
}

function translateSelectorText(text) {
  let out = translateAtRules(text);
  out = out.replace(/@media\s*\(([^)]+)\)/gi, (match, cond) => {
    return `@media (${translateMedia(cond)})`;
  });
  out = translateSelector(out);
  return out;
}

function translateDeclarations(text) {
  // traducir propiedades
  let out = text.replace(/([a-zA-Z-]+)\s*:/g, (match, prop) => {
    if (prop.startsWith("--")) return match;

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

  // traducir valores (solo dentro de bloques)
  out = out.replace(/:\s*([^;]+)/g, (match, value) => {
    return ": " + translate(value.trim());
  });

  return out;
}

function translateCSS(css) {
  let result = "";
  let buffer = "";
  let depth = 0;
  let inString = false;
  let stringChar = "";
  for (let i = 0; i < css.length; i++) {
    const char = css[i];
    const prev = css[i - 1];

    if (inString) {
      buffer += char;
      if (char === stringChar && prev !== "\\") {
        inString = false;
        stringChar = "";
      }
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      stringChar = char;
      buffer += char;
      continue;
    }

    if (char === "{") {
      const header = translateSelectorText(buffer);
      result += header + "{";
      buffer = "";
      depth++;
      continue;
    }

    if (char === "}") {
      const body = translateDeclarations(buffer);
      result += body + "}";
      buffer = "";
      depth = Math.max(0, depth - 1);
      continue;
    }

    buffer += char;
  }

  if (buffer) {
    if (depth > 0) {
      result += translateDeclarations(buffer);
    } else {
      result += translateSelectorText(buffer);
    }
  }

  return result;
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
      // mover nodos hijos reales para no recrearlos desde HTML
      while (el.firstChild) {
        nuevo.appendChild(el.firstChild)
      }
      el.replaceWith(nuevo)
    })
  })
}
parseTags();
parseEstilos();
parseAttr();


