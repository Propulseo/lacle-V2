# Design System Summary — Institut La Clé

---

## PALETTE COULEURS

### Backgrounds (du plus sombre au plus clair)
| Nom | Hex | RGB | Usage |
|-----|-----|-----|-------|
| **Noir** | `#0B0B0B` | `rgb(11,11,11)` | Background principal, body |
| **Graphite** | `#131313` | `rgb(19,19,19)` | Sections alternées (50% opacité), cards |
| **Ardoise** | `#1A1A1A` | `rgb(26,26,26)` | Hover cards, backgrounds interactifs |
| **Charbon** | `#222222` | `rgb(34,34,34)` | Accent léger sur fond sombre |

### Texte
| Nom | Hex | RGB | Usage |
|-----|-----|-----|-------|
| **Ivoire** | `#F5F0EB` | `rgb(245,240,235)` | Titres, texte principal, couleur primaire texte |
| **Cendre** | `#A09A93` | `rgb(160,154,147)` | Corps de texte, descriptions, sous-titres |
| **Pierre** | `#6B665F` | `rgb(107,102,95)` | Navigation, labels tertiaires, metadata |

### Accent (Bronze)
| Nom | Hex | RGB | Usage |
|-----|-----|-----|-------|
| **Bronze** | `#B08D57` | `rgb(176,141,87)` | Accent principal, labels, focus, selection, CTA filled |
| **Bronze Clair** | `#C9A96E` | `rgb(201,169,110)` | Hover sur accent (titres, icônes) |
| **Bronze Sombre** | `#8A6D3B` | `rgb(138,109,59)` | Variante foncée, ombres accent |

### Profondeur (Aurora)
| Nom | Hex | RGB | Usage |
|-----|-----|-----|-------|
| **Nuit** | `#0E162A` | `rgb(14,22,42)` | Base aurora, ambiance nuit |
| **Nuit Profond** | `#0B1224` | `rgb(11,18,36)` | Variante plus sombre |
| **Prune Sombre** | `#1A1022` | `rgb(26,16,34)` | Touche violette aurora |

### Aurora Blobs (couleurs dynamiques)
| Blob | Couleur | Opacité | Blur |
|------|---------|---------|------|
| Blob 1 | `rgb(20,50,120)` | 0.25–0.5 | 100px |
| Blob 2 | `rgb(15,40,100)` | 0.2–0.4 | 90px |
| Blob 3 | `rgb(22,50,110)` | 0.18–0.35 | 80px |
| Blob 4 | `rgb(35,18,60)` | 0.1–0.22 | 100px |

### Bordures
| Nom | Hex | Usage |
|-----|-----|-------|
| **Filet** | `#2A2A2A` | Bordures standard, séparateurs, scrollbar |
| **Filet Discret** | `#1E1E1E` | Bordures subtiles, header bottom |
| **Filet Accent** | `#3D3530` | Bordures hover (teinture bronze) |

---

## TYPOGRAPHIE

### Familles
| Rôle | Police | Fallback | Source |
|------|--------|----------|--------|
| **Titres** (serif) | Cormorant Garamond | Georgia, serif | Google Fonts |
| **Corps** (sans) | DM Sans | Helvetica Neue, sans-serif | Google Fonts |

### Hiérarchie des titres
| Niveau | Taille | Détails |
|--------|--------|---------|
| H1 | `clamp(2.5rem, 5vw, 4.5rem)` | Cormorant 400, letter-spacing: -0.01em, line-height: 1.15 |
| H2 | `clamp(2rem, 4vw, 3.5rem)` | Idem |
| H3 | `clamp(1.5rem, 3vw, 2.25rem)` | Idem |
| H4 | `clamp(1.25rem, 2.5vw, 1.75rem)` | Idem |
| H5 | `1.25rem` | Idem |
| H6 | `1.125rem` | Idem |

### Styles texte récurrents
| Style | Police | Taille | Poids | Tracking | Casse | Couleur |
|-------|--------|--------|-------|----------|-------|---------|
| Body | DM Sans | 1rem | 400 | normal | normal | Cendre |
| Label/Tag | DM Sans | 10px | 700 | 0.2em | UPPERCASE | Bronze |
| Sous-label | DM Sans | 10px | 400 | 0.15em | UPPERCASE | Pierre |
| Navigation | DM Sans | 12px | 400 | 0.1em | UPPERCASE | Pierre |
| Button | DM Sans | 12px | 400 | 0.12em | UPPERCASE | Ivoire |
| Button large | DM Sans | 14px | 400 | 0.12em | UPPERCASE | Ivoire |
| Baseline splash | Cormorant | 1.25rem | 400 | 0.15em | normal | Cendre |
| Chiffre décoratif | Cormorant | 5–6rem | 300 (light) | normal | normal | Ivoire/3% ou Bronze/20% |

---

## STYLES DE BOUTONS

### Default
- `border: 1px solid #2A2A2A (filet)`
- `color: #F5F0EB (ivoire)`
- `padding: 14px 32px` (default) / `20px 48px` (large)
- `font-size: 12px` (default) / `14px` (large)
- `letter-spacing: 0.12em`
- `text-transform: uppercase`
- `border-radius: 0` (carré)
- Hover: `border-color: #B08D57, color: #C9A96E`
- Transition: `500ms ease-[cubic-bezier(0.16,1,0.3,1)]`

### Ghost
- `text-decoration: underline`
- `text-underline-offset: 4px`
- `decoration-color: #2A2A2A (filet)`
- `color: #A09A93 (cendre)`
- Hover: `color: ivoire, decoration: bronze`

### CTA Filled (accès espace)
- `background: #B08D57 (bronze)`
- `color: #0B0B0B (noir)`
- `padding: 14px 24px`
- Hover: `background: #C9A96E (bronze-clair)`

### Pill (header connexion)
- `border-radius: 9999px (full)`
- `border: 1px solid #1E1E1E`
- `padding: 6px 12px`
- Hover: `border-color: bronze/50, bg: bronze/5`

---

## STYLES DE CARTES

### Hub Card
- `border: 1px solid #2A2A2A`
- `background: rgba(26,26,26,0.4)` (ardoise/40)
- `padding: 32–40px`
- Hover: `-translate-y-1, border: filet-accent`
- Transition: `500ms ease-institutional`

### Formation Card (active)
- `border: 1px solid #2A2A2A`
- `background: rgba(19,19,19,0.6)` (graphite/60)
- `padding: 32–48px`
- Left accent: gradient bronze vertical
- Hover: `border: filet-accent, bg: ardoise/60`

### Module Card
- `border: 1px solid #2A2A2A`
- `background: rgba(19,19,19,0.4)` (graphite/40)
- `padding: 24–32px`
- Ghost number en arrière-plan (3% opacité)
- Bottom accent line: `w-8 → w-12` on hover

---

## BORDURES & SÉPARATEURS

- Standard: `1px solid #2A2A2A`
- Subtile: `1px solid #1E1E1E`
- Accent hover: `1px solid #3D3530`
- Séparateur sections: `border-t border-filet`
- Gradient separator: `h-20 w-px bg-gradient-to-b from-transparent via-bronze/30 to-transparent`

---

## OMBRES

Aucune `box-shadow` utilisée. La profondeur est créée par :
- Superposition de fonds (noir → graphite → ardoise)
- Opacités variables
- `backdrop-blur-md` (header uniquement)
- Gradients radiaux (aurora)

---

## RAYONS (border-radius)

- **Cartes, boutons, sections** : `0` (angles droits partout)
- **Pill header** : `9999px` (full round)
- **Timeline nodes** : `50%` (circles)
- **Espace apprenant icon circles** : `50%`
- **Scrollbar thumb** : `3px`
- Principe : angulaire et strict, le rond est réservé aux éléments symboliques

---

## SPACING

| Contexte | Padding |
|----------|---------|
| Container max | `max-w-[1200px]` |
| Section padding | `py-20 md:py-28 lg:py-32` |
| Container sides | `px-6 md:px-10 lg:px-16` |
| Header height | `h-16` (64px) |
| Card padding | `p-8 md:p-10 lg:p-12` |
| Inter-card gap | `gap-6` |
| Inter-section gap | `mb-12 / mb-16` |

---

## EASINGS CUSTOM

| Nom | Valeur | Usage |
|-----|--------|-------|
| Institutional | `cubic-bezier(0.16, 1, 0.3, 1)` | Transitions principales, scroll reveal, boutons |
| Smooth | `cubic-bezier(0.65, 0, 0.35, 1)` | Splash exit, accordions, stroke draw |

---

## ANIMATIONS

### Patterns d'animation
| Pattern | Durée | Ease | Usage |
|---------|-------|------|-------|
| fadeInUp | 800ms | Institutional | Entrée par défaut au scroll |
| fadeIn | 600ms | Institutional | Apparitions simples |
| stagger | 150ms entre enfants | — | Groupes d'éléments |
| stroke draw | 800ms | Smooth | Key symbol paths |
| hover accent line | 500ms | default | `w-8→w-12` ou `w-0→w-12` |
| card lift | 500ms | Institutional | `-translate-y-1` |

### Splash Screen
- Durée totale : 1800ms
- Séquence : circle draw (0s) → shaft draw (0.3s) → tooth1 (0.7s) → tooth2 (0.9s) → baseline text (1.0s) → container fadeOut (1.8s)

---

## PRINCIPES GRAPHIQUES RÉCURRENTS

1. **Minimalisme radical** — pas de décoration superflue
2. **Contraste doux** — ivoire sur noir, jamais du blanc pur
3. **Bronze comme signal** — l'accent n'apparaît que pour guider (labels, focus, hover)
4. **Angles droits** — rigueur institutionnelle, pas de coins arrondis sauf exceptions symboliques
5. **Profondeur par couches** — superposition d'opacités plutôt que shadows
6. **Animation contenue** — mouvements lents, jamais brusques, ease-out prononcé
7. **Hiérarchie par taille** — les titres sont grands, le reste est petit et uppercase
8. **Espaces généreux** — beaucoup de vide, respiration entre les blocs
9. **Aurora atmosphérique** — ambiance vivante mais subtile en arrière-plan

---

## AMBIANCE VISUELLE

**Mots-clés** : Institutionnel premium, nuit profonde, sobriété élégante, rigueur intellectuelle, calme, introspectif, confidentiel, maîtrisé

**Analogies visuelles** : Club privé intellectuel, bibliothèque de nuit, observatoire, monastère contemporain

**Ce que l'univers visuel communique** : sérieux sans froideur, profondeur sans lourdeur, prestige sans ostentation
