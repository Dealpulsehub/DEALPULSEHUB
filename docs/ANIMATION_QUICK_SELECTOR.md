# ⚡ SELECTOR RÁPIDO DE ANIMACIONES

## 🎯 ¿Cuál es tu nicho?

### SaaS / Software
```
Presiona: 1
Perfil: Professional, Modern, Technical
Animaciones: Slow (800ms), FadeInText, ScrollReveal
Imágenes: Dashboard, Screenshots, Code
Ejemplo: "Build trust through clarity"
```

### E-commerce / Tienda Online
```
Presiona: 2
Perfil: Energetic, Playful, Urgent
Animaciones: Fast (200ms), Pulse, Bounce
Imágenes: Product Photos, Lifestyle, Social Proof
Ejemplo: "Drive conversions NOW"
```

### Coaching / Education
```
Presiona: 3
Perfil: Inspirational, Supportive, Growth
Animaciones: Normal (400ms), FadeInText, ScrollReveal
Imágenes: Success Stories, Transformations, Certificates
Ejemplo: "Change lives through education"
```

### Agencia Digital / Marketing
```
Presiona: 4
Perfil: Creative, Professional, Results-focused
Animaciones: Medium (400ms), Parallax, LottieAnimation
Imágenes: Case Studies, Metrics, Team, Portfolio
Ejemplo: "Show creative excellence"
```

### Real Estate / Propiedad
```
Presiona: 5
Perfil: Aspirational, Trustworthy, Luxury
Animaciones: Slow (800ms), Parallax, 3D
Imágenes: Property Photos, Virtual Tours, Neighborhoods
Ejemplo: "Find your dream home"
```

---

## 📋 TU CHECKLIST DE SELECCIÓN

Una vez que elegiste tu nicho, sigue este checklist:

### Paso 1: Tipo de Página
```
[ ] HERO          → AnimatedHero + FadeInText
[ ] FEATURES      → ScrollReveal grid + Cards
[ ] TESTIMONIALS  → FadeInText + Card cascade
[ ] PRICING       → ParallaxSection + Badge
[ ] PORTFOLIO     → LottieAnimation + ScrollReveal
[ ] CTA FINAL     → AnimatedHero + Button hover
```

### Paso 2: Velocidad
```
[ ] FAST (200ms)     - Urgencia, demos, interactive
[ ] NORMAL (400ms)   - Estándar, versátil
[ ] SLOW (800ms)     - Lujo, profesionalismo
[ ] VERY SLOW (1200ms) - Hero épico
```

### Paso 3: Dirección (ScrollReveal)
```
[ ] UP    - Ascendente, optimista, crecimiento ⬆️
[ ] DOWN  - Revelación, descubrimiento ⬇️
[ ] LEFT  - Narrativa occidental, flujo natural ⬅️
[ ] RIGHT - Énfasis, spotlight, importancia ➡️
```

### Paso 4: Imágenes
```
[ ] Screenshots/Dashboards
[ ] Product Photography
[ ] People/Testimonials
[ ] Metrics/Charts
[ ] 3D/Video
[ ] Icons/Illustrations
```

### Paso 5: Interactividad
```
[ ] Loop (auto-repeat)
[ ] On Scroll Trigger
[ ] On Hover
[ ] On Click
[ ] Parallax Follow
```

---

## 🚀 GENERADOR RÁPIDO

**Paso 1:** Elige tu nicho (1-5)  
**Paso 2:** Selecciona qué página necesitas  
**Paso 3:** Usa la tabla para tu componente + speed  
**Paso 4:** Agrega tus imágenes correlacionadas  
**Paso 5:** Copia el código de ejemplo  

**¡Listo en 5 minutos!**

---

## 📚 REFERENCIAS RÁPIDAS

| Nicho | Hero Component | Features Section | CTA Final |
|-------|---|---|---|
| **SaaS** | AnimatedHero (slow) | ScrollReveal ↑ | FadeInText + Button |
| **E-com** | AnimatedHero (fast) + pulse | ScrollReveal ↔️ | Urgent + Button |
| **Coaching** | Parallax + AnimatedHero | ScrollReveal ↓ | Inspirational CTA |
| **Agencia** | Parallax + AnimatedHero | LottieAnimation | Results showcase |
| **Real Estate** | Parallax + Video | ScrollReveal 360° | Schedule tour |

---

## 💡 NIVEL AVANZADO: Personalización

Si quieres ir más allá de los presets:

1. **Color Override**
   ```tsx
   <AnimatedHero
     title="Custom Title"
     backgroundColor={colors.primary[100]}
   />
   ```

2. **Custom Timing**
   ```tsx
   <ScrollReveal duration={1.2} delay={0.5}>
     Content
   </ScrollReveal>
   ```

3. **Custom Easing**
   ```tsx
   transition={{
     duration: 0.8,
     easing: "easeInOut"
   }}
   ```

4. **Lottie Custom**
   - Export tu animación desde Figma → JSON
   - Importa y usa con `<LottieAnimation animationData={yourJSON} />`

---

## ✅ PRÓXIMOS PASOS

1. Identifica tu NICHO (1-5)
2. Elige PÁGINA que necesitas
3. Copia el CÓDIGO DE EJEMPLO
4. Reemplaza con tus IMÁGENES
5. Ajusta COLORES si necesitas
6. Deploy y ¡listo!

