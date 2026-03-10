# spanishHtml 🇪🇸

> ⚠️ **En fase de construcción** - Este proyecto está en desarrollo activo. Las características y la API pueden cambiar.

Un parser que te permite escribir **HTML y CSS completamente en español**. Traduce automáticamente las etiquetas HTML, atributos y propiedades CSS del español al inglés estándar.

## 🎯 Características

- ✅ **Etiquetas HTML en español** - Usa nombres descriptivos como `titulo1`, `texto`, `contenedor` en lugar de `h1`, `p`, `div`
- 🎨 **Propiedades CSS en español** - Escribe `margen`, `fondo`, `color` en lugar de `margin`, `background`, `color`
- 🌈 **Colores en español** - Usa nombres de colores en español como `azul`, `rojo`, `verde`, `verdemarinoclaro`
- ⚡ **Traducción automática** - El parser convierte tu código español a HTML/CSS válido automáticamente
- 📦 **Fácil de usar** - Solo importa el script y usa atributos en español

## 📝 Ejemplos de uso

### Etiquetas HTML

| Español | HTML Estándar |
|---------|---------------|
| `titulo1` | `<h1>` |
| `titulo2` | `<h2>` |
| `texto` | `<p>` |
| `contenedor` | `<div>` |
| `principal` | `<main>` |
| `menu-sup` | `<nav>` |
| `articulo` | `<article>` |
| `seccion` | `<section>` |
| `final` | `<footer>` |

### Atributos CSS

| Español | CSS Estándar |
|---------|--------------|
| `margen` | `margin` |
| `fondo` | `background` |
| `color` | `color` |
| `alto` | `height` |
| `ancho` | `width` |
| `relleno` | `padding` |
| `borde` | `border` |
| `tamañoDtexto` | `font-size` |
| `colorDtexto` | `color` |

### Colores en Español

```
azul, rojo, verde, amarillo, naranja, morado, cafe, etc.
```

## 🚀 Cómo empezar

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tuusuario/spanishHtml.git
```

2. Incluye el script en tu HTML:
```html
<script type="module" src="src/main.js"></script>
```

### Ejemplo básico

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Mi página en español</title>
  <link href="src/default.css" rel="stylesheet">
</head>
<body margen="0px" fondo="rgb(0, 20, 30)">
  
  <menu-sup ancho="100%" alto="36px" fondo="verdemarinoclaro">
    <!-- Menú aquí -->
  </menu-sup>

  <principal borde="3px solido azul" margen="7px" relleno="10px">
    <titulo1>¡Hola mundo!</titulo1>
    <salto_de_linea/>
    <texto tamañoDtexto="19px">
      Este es un ejemplo de HTML en español
    </texto>
  </principal>

  <script type="module" src="src/main.js"></script>
</body>
</html>
```

## 📂 Estructura del proyecto

```
spanishHtml/
├── src/
│   ├── main.js           # Script principal que hace la traducción
│   ├── dictionary.js     # Diccionario HTML e-s / s-e
│   ├── AllCssProps.js    # Mapeo de propiedades CSS
│   ├── default.css       # Estilos por defecto
│   └── pum.js            # Utilidades adicionales
├── demo/
│   └── index.html        # Ejemplo de uso
├── docs/
│   └── html to spanish.txt # Documentación de traducciones
└── README.md
```

## 🔧 Tecnología

- **JavaScript Vanilla** - Sin dependencias externas
- **ES6 Modules** - Sintaxis moderna de módulos
- **CSS** - Estilos predefinidos

## 💡 Ventajas

✨ Ideal para:
- Desarrolladores que prefieren programar en español
- Educación y enseñanza de HTML/CSS en español
- Proyectos con equipos hispanohablantes
- Prototipado rápido en idioma español

## 📚 Documentación adicional

Consulta el archivo `docs/html to spanish.txt` para ver la lista completa de traducciones disponibles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz un Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaFeature`)
3. Commit tus cambios (`git commit -m 'Agrega NuevaFeature'`)
4. Push a la rama (`git push origin feature/NuevaFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo licencia [Especifica tu licencia aquí]

## 🎓 Aprende más

- Revisa el archivo `demo/index.html` para ver ejemplos prácticos
- Explora `src/dictionary.js` para entender el mapeo de traducciones
- Consulta `src/AllCssProps.js` para ver las propiedades CSS disponibles

---

**Hecho con ❤️ para la comunidad hispanohablante**
