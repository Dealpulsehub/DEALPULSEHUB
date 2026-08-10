# 🎬 Animaciones - Guía Completa

Componentes y sistemas de animación para DealPulseHub Design System.

## Componentes Animados

### 1. AnimatedHero

Hero section con animaciones de entrada en cascada.

```tsx
import { AnimatedHero } from '@dealpulsehub/design-system';

<AnimatedHero
  title="Welcome to DealPulseHub"
  subtitle="Create amazing animations effortlessly"
  image="hero.jpg"
  cta={{
    text: 'Get Started',
    onClick: () => console.log('clicked'),
  }}
/>
```

**Props:**
- `title: string` - Título principal
- `subtitle: string` - Subtítulo
- `image?: string` - URL de imagen
- `cta?: { text: string; onClick: () => void }` - Call-to-action button

---

### 2. ScrollReveal

Revela elementos cuando entran en el viewport.

```tsx
import { ScrollReveal } from '@dealpulsehub/design-system';

<ScrollReveal direction="up" delay={0.2}>
  <Card>
    <h3>Animates on scroll</h3>
  </Card>
</ScrollReveal>
```

**Props:**
- `direction?: 'up' | 'down' | 'left' | 'right'` - Direction of animation
- `delay?: number` - Delay in seconds (default: 0)
- `duration?: number` - Duration in seconds (default: 0.6)
- `children: React.ReactNode` - Content to animate

---

### 3. FadeInText

Anima texto palabra por palabra.

```tsx
import { FadeInText } from '@dealpulsehub/design-system';

<FadeInText
  text="Amazing animated text appears word by word"
  size="lg"
  duration={0.4}
/>
```

**Props:**
- `text: string` - Texto a animar
- `size?: 'sm' | 'md' | 'lg' | 'xl'` - Tamaño
- `duration?: number` - Duration per word (default: 0.5)
- `delay?: number` - Initial delay (default: 0)

---

### 4. ParallaxSection

Efecto parallax al hacer scroll.

```tsx
import { ParallaxSection } from '@dealpulsehub/design-system';

<ParallaxSection speed={0.5}>
  <h2>Parallax Content</h2>
  <p>Moves as you scroll</p>
</ParallaxSection>
```

**Props:**
- `speed?: number` - Parallax speed (0-1, default: 0.5)
- `background?: string` - Background color
- `children: React.ReactNode` - Content

---

### 5. LottieAnimation

Reproduce animaciones Lottie (After Effects).

```tsx
import { LottieAnimation } from '@dealpulsehub/design-system';
import animationData from './animation.json';

<LottieAnimation
  animationData={animationData}
  loop={true}
  autoplay={true}
  width={300}
  height={300}
/>
```

**Props:**
- `animationData: any` - Lottie JSON data (required)
- `loop?: boolean` - Loop animation (default: true)
- `autoplay?: boolean` - Auto-play (default: true)
- `width?: number` - Width in px (default: 300)
- `height?: number` - Height in px (default: 300)
- `speed?: number` - Playback speed (default: 1)

---

## 🎯 Animation Tokens

```tsx
import { animationTokens, animationPresets } from '@dealpulsehub/design-system';

// Timing
animationTokens.timing.fast      // 200ms
animationTokens.timing.normal    // 400ms
animationTokens.timing.slow      // 800ms
animationTokens.timing.verySlow  // 1200ms

// Delay
animationTokens.delay.xs  // 50ms
animationTokens.delay.md  // 200ms
animationTokens.delay.lg  // 300ms

// Presets
animationPresets.fadeIn
animationPresets.slideUp
animationPresets.slideDown
animationPresets.slideLeft
animationPresets.slideRight
animationPresets.scaleIn
animationPresets.bounce
animationPresets.pulse
```

---

## 📚 Ejemplos Avanzados

### Landing Page Completa

```tsx
import {
  AnimatedHero,
  ScrollReveal,
  FadeInText,
  Card,
  Button,
} from '@dealpulsehub/design-system';

export const LandingPage = () => (
  <>
    <AnimatedHero
      title="Welcome"
      subtitle="Amazing animations"
      image="hero.jpg"
    />

    <ScrollReveal direction="up">
      <FadeInText text="See our features" size="lg" />
    </ScrollReveal>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
      {[1, 2, 3].map((i) => (
        <ScrollReveal key={i} direction="up" delay={i * 0.2}>
          <Card>
            <h3>Feature {i}</h3>
            <p>Amazing features</p>
            <Button variant="primary">Learn more</Button>
          </Card>
        </ScrollReveal>
      ))}
    </div>
  </>
);
```

---

## ✅ Best Practices

- Use `ScrollReveal` for content that appears on scroll
- Use `AnimatedHero` for hero sections
- Use `FadeInText` for impactful text
- Use `LottieAnimation` for complex animations from Figma
- Always set `duration` based on content importance
- Use `delay` to create visual hierarchy

---

## 🔗 Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Lottie Animation](https://lottiefiles.com/)
- [Animation Best Practices](https://web.dev/animations/)

---

Ver README.md para más información.
