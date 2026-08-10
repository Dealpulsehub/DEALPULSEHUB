# 🎬 Animation Examples

Quick reference for using animated components.

## Example 1: Animated Hero with Parallax

```tsx
import { AnimatedHero, ParallaxSection } from '@dealpulsehub/design-system';

export const HeroSection = () => (
  <ParallaxSection speed={0.3}>
    <AnimatedHero
      title="Transform Your Business"
      subtitle="With powerful animations and design"
      image="hero.jpg"
      cta={{
        text: 'Start Free Trial',
        onClick: () => window.location.href = '/signup',
      }}
    />
  </ParallaxSection>
);
```

---

## Example 2: Staggered Card Grid

```tsx
import { ScrollReveal, Card, Button } from '@dealpulsehub/design-system';

const features = [
  { title: 'Fast', desc: 'Ultra-fast performance' },
  { title: 'Reliable', desc: 'Always available' },
  { title: 'Scalable', desc: 'Grows with you' },
];

export const FeaturesSection = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
    {features.map((f, i) => (
      <ScrollReveal key={i} direction="up" delay={i * 0.2}>
        <Card>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
          <Button variant="secondary">Learn more</Button>
        </Card>
      </ScrollReveal>
    ))}
  </div>
);
```

---

## Example 3: Animated Text with Fade

```tsx
import { FadeInText } from '@dealpulsehub/design-system';

export const Hero = () => (
  <>
    <FadeInText
      text="Welcome to the future of design systems"
      size="xl"
      duration={0.3}
    />
    <FadeInText
      text="Build amazing products faster than ever"
      size="lg"
      delay={0.5}
      duration={0.3}
    />
  </>
);
```

---

## Example 4: Animated Landing Page

```tsx
import {
  AnimatedHero,
  ScrollReveal,
  FadeInText,
  ParallaxSection,
  Card,
  Button,
  Badge,
} from '@dealpulsehub/design-system';

export const LandingPage = () => (
  <div>
    {/* Hero */}
    <AnimatedHero
      title="DealPulseHub"
      subtitle="Professional Design System"
      image="hero.jpg"
      cta={{ text: 'Get Started', onClick: () => {} }}
    />

    {/* Features */}
    <section style={{ padding: '60px 20px' }}>
      <FadeInText text="Powerful Features" size="lg" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', marginTop: '40px' }}>
        {['React Components', 'Design Tokens', 'Figma Integration', 'Animations'].map((f, i) => (
          <ScrollReveal key={i} direction="left" delay={i * 0.15}>
            <Card>
              <Badge variant="primary">{f}</Badge>
              <h3 style={{ marginTop: '15px' }}>{f}</h3>
              <p>Professional-grade {f.toLowerCase()}</p>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </section>

    {/* Parallax Section */}
    <ParallaxSection speed={0.4} background="#f3f4ff">
      <h2>Why Choose Us?</h2>
      <p>Built for modern teams</p>
    </ParallaxSection>

    {/* CTA */}
    <section style={{ textAlign: 'center', padding: '60px 20px' }}>
      <ScrollReveal>
        <h2>Ready to transform?</h2>
        <Button variant="primary" style={{ marginTop: '20px' }}>
          Start Building
        </Button>
      </ScrollReveal>
    </section>
  </div>
);
```

---

## Performance Tips

✅ Use `triggerOnce: true` for better performance  
✅ Set appropriate `duration` based on content  
✅ Use `delay` strategically for hierarchy  
✅ Test on mobile devices  
✅ Respect `prefers-reduced-motion` for accessibility

---

## Lottie Animation Setup

1. Create animation in After Effects or Figma
2. Export as Lottie JSON
3. Import and use:

```tsx
import animationData from './my-animation.json';
import { LottieAnimation } from '@dealpulsehub/design-system';

<LottieAnimation animationData={animationData} />
```

Resources: https://lottiefiles.com/

