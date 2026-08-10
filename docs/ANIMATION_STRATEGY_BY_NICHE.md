# 🎬 Estrategia de Animaciones por Nicho

## ¿Cómo Funciona?

**Tu eliges:**
1. El NICHO de tu producto (SaaS, E-commerce, Coaching, Agencia, etc.)
2. El TIPO DE PÁGINA (Hero, Features, Pricing, Testimonials, CTA)
3. El TONO (Profesional, Energético, Minimalista, Playful)

**Nosotros recomendamos:**
- Animaciones específicas para ese nicho
- Paleta de colores
- Imágenes/Iconos correlacionados
- Timing y easing óptimos

---

## 📊 MATRIZ DE SELECCIÓN

### 1️⃣ NICHO: SaaS (Software as a Service)

**Características:**
- Audiencia: Tech professionals, CTOs, Product managers
- Tono: Professional, Modern, Technical
- Objetivo: Build trust + Show complexity simply

**Animaciones Recomendadas:**

| Página | Animación | Speed | Timing | Efecto |
|--------|-----------|-------|--------|--------|
| Hero | FadeInText + AnimatedHero | slow (800ms) | staggerChildren | Professional entrada |
| Features | ScrollReveal (up) | slow | triggerOnce | Reveal gradual |
| Pricing | ParallaxSection | medium (400ms) | parallax 0.3 | Profundidad |
| Demo Video | LottieAnimation | auto | loop: true | Interactivo |
| CTA | AnimatedHero + Button hover | fast (200ms) | scaleIn | Urgencia |

**Ejemplo de Hero:**
```tsx
<AnimatedHero
  title="Enterprise-Grade Software"
  subtitle="Built for teams that scale"
  image="dashboard-screenshot.png"
  cta={{ text: 'Start Free Trial', onClick: handleSignup }}
/>
```

**Imágenes Correlacionadas:**
- Dashboard screenshots
- Code snippets
- Team collaboration scenes
- Growth charts

---

### 2️⃣ NICHO: E-commerce (Tienda Online)

**Características:**
- Audiencia: Consumers, impulse buyers
- Tono: Energetic, Playful, Urgent
- Objetivo: Drive conversions + Showcase products

**Animaciones Recomendadas:**

| Página | Animación | Speed | Timing | Efecto |
|--------|-----------|-------|--------|--------|
| Hero | AnimatedHero + pulse | fast (200ms) | bounce | Energía |
| Products | ScrollReveal (left/right) | medium | staggered grid | Showcase |
| Reviews | FadeInText | normal (400ms) | cascade | Social proof |
| Flash Sale | Pulse + Badge | fast | loop | FOMO urgencia |
| Checkout | ScaleIn | normal | sequence | Trust building |

**Ejemplo de Flash Sale:**
```tsx
<motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
  <Badge variant="error">LIMITED TIME</Badge>
  <h2>Flash Sale - 48 Hours</h2>
  <img src="product.jpg" />
</motion.div>
```

**Imágenes Correlacionadas:**
- Product photographs (lifestyle context)
- Customer testimonials (real people)
- Stock photos (aspirational)
- Packaging/unboxing videos

---

### 3️⃣ NICHO: Coaching/Education

**Características:**
- Audiencia: Learners, ambitious professionals
- Tono: Inspirational, Supportive, Growth-focused
- Objetivo: Inspire + Build credibility

**Animaciones Recomendadas:**

| Página | Animación | Speed | Timing | Efecto |
|--------|-----------|-------|--------|--------|
| Hero | FadeInText + Parallax | slow | motivational | Inspirational |
| Curriculum | ScrollReveal (down) | medium | progressive | Learning journey |
| Success Stories | LottieAnimation | medium | highlight wins | Social proof |
| Testimonials | FadeInText + Card | normal | staggered | Credibility |
| Enroll CTA | AnimatedHero + Button | normal | confident | Call to action |

**Ejemplo de Success Stories:**
```tsx
<ScrollReveal direction="up" delay={0.3}>
  <Card>
    <img src="student-photo.jpg" />
    <h3>From $0 to $100k in 6 months</h3>
    <p>"This course changed my life..."</p>
  </Card>
</ScrollReveal>
```

**Imágenes Correlacionadas:**
- Student success photos
- Before/after transformations
- Course modules screenshots
- Certificate/achievement badges

---

### 4️⃣ NICHO: Agencia Digital/Marketing

**Características:**
- Audiencia: Business owners, marketing directors
- Tono: Professional, Creative, Results-focused
- Objetivo: Show creativity + Demonstrate ROI

**Animaciones Recomendadas:**

| Página | Animación | Speed | Timing | Efecto |
|--------|-----------|-------|--------|--------|
| Hero | ParallaxSection + AnimatedHero | slow | luxury feel | Premium |
| Portfolio | ScrollReveal (up) + LottieAnimation | medium | case study focus | Showcase |
| Services | FadeInText + Card grid | normal | progressive reveal | Comprehensive |
| Results | Pulse + numbers animation | fast | highlight metrics | Impact |
| Contact | AnimatedHero + ScaleIn | normal | professional | Trust |

**Ejemplo de Portfolio:**
```tsx
{caseStudies.map((study, i) => (
  <ScrollReveal key={i} direction="up" delay={i * 0.2}>
    <Card>
      <img src={study.image} />
      <Badge variant="primary">{study.result}</Badge>
      <h3>{study.title}</h3>
    </Card>
  </ScrollReveal>
))}
```

**Imágenes Correlacionadas:**
- Client case studies
- Before/after results
- Team photos
- Project screenshots
- Growth metrics/charts

---

### 5️⃣ NICHO: Real Estate

**Características:**
- Audiencia: Property buyers/renters
- Tono: Professional, Trustworthy, Aspirational
- Objetivo: Showcase properties + Build confidence

**Animaciones Recomendadas:**

| Página | Animación | Speed | Timing | Efecto |
|--------|-----------|-------|--------|--------|
| Hero | ParallaxSection + hero video | slow | luxury feel | Premium |
| Property Showcase | LottieAnimation + 3D | medium | interactive explore | Visual interest |
| Virtual Tour | ScrollReveal (circular) | slow | immersive | Exploration |
| Testimonials | FadeInText + Card | normal | cascade | Trust |
| Schedule Tour | AnimatedHero + Button | normal | confident | CTA |

**Ejemplo de Property Showcase:**
```tsx
<ParallaxSection speed={0.4} background="property-image.jpg">
  <h2>Luxury Penthouse Downtown</h2>
  <Badge variant="primary">3 Bed • 2 Bath • $850k</Badge>
</ParallexSection>
```

**Imágenes Correlacionadas:**
- Professional property photography
- Floor plans
- Neighborhood/lifestyle photos
- 360° virtual tours
- Market data/statistics

---

## 🎯 MATRIZ DE DECISIÓN (Paso a Paso)

### Paso 1: Identifica tu Nicho
```
¿Qué vendes?
└─ SaaS? → Usa: slow + professional
└─ E-commerce? → Usa: fast + playful
└─ Coaching? → Usa: normal + inspirational
└─ Agencia? → Usa: medium + creative
└─ Real Estate? → Usa: slow + aspirational
```

### Paso 2: Elige el Tipo de Página
```
¿Qué sección es?
├─ HERO → AnimatedHero + FadeInText
├─ FEATURES → ScrollReveal grid
├─ TESTIMONIALS → FadeInText + Card cascade
├─ PRICING → ParallaxSection
├─ PORTFOLIO → LottieAnimation + ScrollReveal
└─ CTA → AnimatedHero + Button hover
```

### Paso 3: Selecciona Speed/Timing
```
¿Qué velocidad?
├─ FAST (200ms) → Energía, urgencia, SaaS demo
├─ NORMAL (400ms) → Estándar, versátil
├─ SLOW (800ms) → Lujo, profesionalismo, reflexión
└─ VERY SLOW (1200ms) → Hero épico
```

### Paso 4: Elige Dirección (si es ScrollReveal)
```
¿De dónde entra?
├─ UP → Ascendente, optimista, crecimiento
├─ DOWN → Revelación, descubrimiento
├─ LEFT → Narrativa occidental, flujo natural
└─ RIGHT → Énfasis, spotlight, importancia
```

### Paso 5: Selecciona Imágenes Correlacionadas
```
¿Qué imagen?
├─ CONTEXTO LIFESTYLE → E-commerce, Real Estate
├─ SCREENSHOT/DEMO → SaaS, Agencia
├─ SOCIAL PROOF → Coaching, Testimonials
├─ METRICS/CHARTS → Performance, ROI
└─ 3D/INTERACTIVE → Premium, Tech-forward
```

---

## 📋 CHECKLISTA DE SELECCIÓN

Para cada página, pregúntate:

- [ ] ¿Cuál es mi nicho? (SaaS/E-com/Coaching/Agencia/Real Estate)
- [ ] ¿Qué tipo de página es? (Hero/Features/Testimonials/Pricing/CTA)
- [ ] ¿Cuál es el tono deseado? (Professional/Energetic/Inspirational/Creative)
- [ ] ¿Quién es mi audiencia? (Tech/Consumer/Learner/Business owner)
- [ ] ¿Cuál es mi objetivo? (Build trust/Drive conversion/Inspire/Showcase)
- [ ] ¿Qué velocidad de animación? (Fast/Normal/Slow)
- [ ] ¿Qué componente animado? (AnimatedHero/ScrollReveal/FadeInText/Parallax/Lottie)
- [ ] ¿Qué imagen correlacionada? (Screenshot/Photo/Chart/Video)
- [ ] ¿Qué dirección de entrada? (Up/Down/Left/Right)
- [ ] ¿Quiero que sea interactivo? (Loop/Play on demand/Trigger on scroll)

---

## 💡 EJEMPLOS COMPLETOS POR NICHO

### EJEMPLO 1: SaaS Landing Page

```tsx
import { AnimatedHero, ScrollReveal, FadeInText } from '@dealpulsehub/design-system';

export const SaaSLanding = () => (
  <>
    {/* HERO - Professional, Slow */}
    <AnimatedHero
      title="Enterprise Analytics Platform"
      subtitle="Make data-driven decisions in seconds"
      image="dashboard-screenshot.png"
      cta={{ text: 'Start Free Trial', onClick: handleSignup }}
    />

    {/* FEATURES - ScrollReveal Up, Staggered */}
    <section>
      <FadeInText text="Powerful Features" size="lg" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {features.map((f, i) => (
          <ScrollReveal key={i} direction="up" delay={i * 0.15}>
            <Card>
              <h3>{f.name}</h3>
              <p>{f.description}</p>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </section>

    {/* SOCIAL PROOF - FadeInText + Cards */}
    <ScrollReveal>
      <FadeInText text="Trusted by 10,000+ companies" size="lg" />
      {testimonials.map((t, i) => (
        <ScrollReveal key={i} delay={i * 0.1}>
          <Card>
            <p>"{t.quote}"</p>
            <strong>{t.author}</strong>
          </Card>
        </ScrollReveal>
      ))}
    </ScrollReveal>

    {/* CTA - Bold, Professional */}
    <AnimatedHero
      title="Ready to transform?"
      subtitle="Join thousands of data-driven teams"
      cta={{ text: 'Get Started Free', onClick: handleSignup }}
    />
  </>
);
```

---

### EJEMPLO 2: E-commerce Product Page

```tsx
import { AnimatedHero, ScrollReveal, LottieAnimation } from '@dealpulsehub/design-system';

export const ProductPage = () => (
  <>
    {/* HERO - Energetic, Fast, Pulse */}
    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
      <AnimatedHero
        title="Premium Wireless Headphones"
        subtitle="Studio Quality Sound, Anywhere"
        image="product-hero.jpg"
        cta={{ text: 'Buy Now', onClick: handleCheckout }}
      />
    </motion.div>

    {/* PRODUCT GALLERY - ScrollReveal Left/Right */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
      <ScrollReveal direction="left">
        <img src="product-front.jpg" style={{ maxWidth: '100%' }} />
      </ScrollReveal>
      <ScrollReveal direction="right">
        <div>
          <h3>Premium Features</h3>
          {features.map((f, i) => (
            <p key={i}>✓ {f}</p>
          ))}
        </div>
      </ScrollReveal>
    </div>

    {/* CUSTOMER REVIEWS - FadeInText Cascade */}
    <FadeInText text="4.9★ From 2,500+ Happy Customers" size="lg" />
    {reviews.map((r, i) => (
      <ScrollReveal key={i} direction="up" delay={i * 0.1}>
        <Card>
          <p>"{r.text}"</p>
          <Badge variant="success">{r.rating}★</Badge>
        </Card>
      </ScrollReveal>
    ))}

    {/* FLASH SALE - Urgent, Pulsing */}
    <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 1, repeat: Infinity }}>
      <h2 style={{ color: colors.semantic.error }}>⏰ LIMITED: 48-Hour Sale</h2>
      <Badge variant="error">Save 30%</Badge>
      <Button variant="primary" onClick={handleCheckout}>Shop Now</Button>
    </motion.div>
  </>
);
```

---

### EJEMPLO 3: Coaching/Course Landing

```tsx
import { AnimatedHero, ScrollReveal, FadeInText, ParallaxSection } from '@dealpulsehub/design-system';

export const CoachingLanding = () => (
  <>
    {/* HERO - Inspirational, Slow */}
    <ParallexSection speed={0.3} background="hero-bg.jpg">
      <AnimatedHero
        title="From Struggling Entrepreneur to 7-Figure Business Owner"
        subtitle="Learn the exact system I used"
        cta={{ text: 'Enroll Now', onClick: handleEnroll }}
      />
    </ParallexSection>

    {/* CURRICULUM - ScrollReveal Down Sequential */}
    <section>
      <FadeInText text="What You'll Learn" size="lg" />
      {modules.map((module, i) => (
        <ScrollReveal key={i} direction="down" delay={i * 0.2}>
          <Card>
            <Badge variant="primary">Module {i + 1}</Badge>
            <h3>{module.title}</h3>
            <ul>
              {module.lessons.map((lesson, j) => (
                <li key={j}>✓ {lesson}</li>
              ))}
            </ul>
          </Card>
        </ScrollReveal>
      ))}
    </section>

    {/* SUCCESS STORIES - Social Proof Heavy */}
    <ScrollReveal>
      <FadeInText text="Success Stories" size="lg" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {successStories.map((story, i) => (
          <ScrollReveal key={i} direction="up" delay={i * 0.15}>
            <Card>
              <img src={story.photo} style={{ width: '100%', borderRadius: '8px' }} />
              <h4>{story.name}</h4>
              <p style={{ color: colors.semantic.success, fontWeight: 'bold' }}>
                {story.result}
              </p>
              <p>"{story.testimonial}"</p>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </ScrollReveal>

    {/* FINAL CTA - Confident */}
    <AnimatedHero
      title="Ready to Transform?"
      subtitle="Your success story starts here"
      cta={{ text: 'Join 5,000+ Students', onClick: handleEnroll }}
    />
  </>
);
```

---

## 🎨 GUÍA DE IMÁGENES POR NICHO

### SaaS
✅ Dashboard screenshots  
✅ Team collaboration  
✅ Growth charts  
✅ Code examples  
✅ App interface mockups  

### E-commerce
✅ Product photography  
✅ Lifestyle context  
✅ Customer testimonials  
✅ Before/after  
✅ Unboxing videos  

### Coaching
✅ Student success photos  
✅ Transformation before/after  
✅ Course materials  
✅ Achievement badges  
✅ Instructor profile  

### Agencia
✅ Case study visuals  
✅ Client logos  
✅ Project screenshots  
✅ Team photos  
✅ ROI metrics/charts  

### Real Estate
✅ Professional property photos  
✅ Floor plans  
✅ Neighborhood lifestyle  
✅ Virtual tours  
✅ Market data charts  

---

## ✅ RESUMO

**TÚ ELIGES:**
- Nicho de negocio
- Tipo de página
- Tono (Professional/Energetic/Inspirational)
- Imágenes correlacionadas

**NOSOTROS RECOMENDAMOS:**
- Componente animado específico
- Speed/timing óptimo
- Dirección de entrada
- Patrón de staggering

**RESULTADO:**
- Landing page perfectamente animada para tu nicho
- Conversiones optimizadas
- Coherencia visual

