import './floating-artifacts.css';
import motifCircle from '../brand/motifs/motif-circle-teal.png';
import motifDiamond from '../brand/motifs/motif-diamond-blue.png';
import motifSquareOrange from '../brand/motifs/motif-square-orange.png';
import motifSquareSky from '../brand/motifs/motif-square-skyblue.png';
import { SparkOrb } from './SparkLogo';

export const MOTIFS = [
  { src: motifCircle,       name: 'circle',         color: 'var(--de-teal-700, #00646a)' },
  { src: motifDiamond,      name: 'diamond',        color: 'var(--de-blue-700, #113879)' },
  { src: motifSquareOrange, name: 'rounded-square', color: 'var(--de-orange-500, #ff734a)' },
  { src: motifSquareSky,    name: 'square',         color: 'var(--de-blue-500, #0080e8)' },
];

/** One drifting motif tile. speed: 'slow' | 'default' | 'fast'; delay staggers the loop. */
export function FloatingMotif({ motif = 'circle', size = 96, speed = 'default', delay = 0, layer }) {
  const m = MOTIFS.find(x => x.name === motif) ?? MOTIFS[0];
  const cls = ['de-float', speed !== 'default' && `de-float--${speed}`, layer && `de-field__${layer}`]
    .filter(Boolean).join(' ');
  return <img className={cls} src={m.src} alt="" width={size} height={size}
              style={{ animationDelay: `${delay}s` }} />;
}

/**
 * Background field of drifting tiles at three depths (blur = distance).
 * Position it absolutely behind hero content; tiles keep their own colours.
 * items: [{ motif, layer: 'far'|'mid'|'near', x: '10%', y: '20%', size, delay }]
 */
export function MotifField({ items, style }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', ...style }}>
      {items.map((it, i) => (
        <span key={i} style={{ position: 'absolute', left: it.x, top: it.y }}>
          <FloatingMotif motif={it.motif} size={it.size ?? 90} layer={it.layer ?? 'mid'}
                         speed={i % 3 === 0 ? 'slow' : i % 3 === 1 ? 'default' : 'fast'}
                         delay={it.delay ?? -(i * 4.7)} />
        </span>
      ))}
    </div>
  );
}

/** The SPARK orb, breathing, with a soft halo. For heroes, loaders, empty states. */
export function BreathingOrb({ size = 56 }) {
  return (
    <span className="de-breathe" style={{ position: 'relative', display: 'inline-flex', width: size, height: size, fontSize: size / 0.27 }}>
      <span className="de-breathe__halo" />
      <SparkOrb className="" style={{ width: size, height: size }} />
    </span>
  );
}

/** 2D orbit ornament: tiny motifs travelling a circle around a breathing orb. */
export function OrbitOrnament({ size = 260, orb = 44, reverse = false }) {
  const r = size / 2 - 18;
  return (
    <span aria-hidden="true" style={{ position: 'relative', display: 'inline-flex', width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <span className={'de-orbit' + (reverse ? ' de-orbit--rev' : '')} style={{ position: 'absolute', inset: 0 }}>
        {MOTIFS.map((m, i) => (
          <span key={m.name} className="de-orbit__pivot"
                style={{ transform: `rotate(${i * 90}deg) translateX(${r}px) rotate(${-i * 90}deg)` }}>
            <img className="de-orbit__item" src={m.src} alt="" width="22" height="22" style={{ display: 'block', margin: '-11px' }} />
          </span>
        ))}
      </span>
      <BreathingOrb size={orb} />
    </span>
  );
}

/** 3D depth ring: the four tiles on white glass plates, slowly carouselling. Navy sections. */
export function DepthRing({ radius = 170, plate = 96, height = 240 }) {
  return (
    <div className="de-ring3d-stage" aria-hidden="true" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="de-ring3d" style={{ width: plate, height }}>
        {MOTIFS.map((m, i) => (
          <span key={m.name} className="de-ring3d__item"
                style={{ transform: `translate(-50%,-50%) rotateY(${i * 90}deg) translateZ(${radius}px)`,
                         width: plate, height: plate, borderRadius: 22, background: 'rgba(255,255,255,0.94)',
                         boxShadow: '0 18px 44px rgba(8,22,49,0.32)', display: 'inline-flex',
                         alignItems: 'center', justifyContent: 'center' }}>
            <img src={m.src} alt="" width={plate * 0.66} height={plate * 0.66} />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Perspective-tilted glass card that wobbles gently. Wrap any content. */
export function TiltCard({ children, width = 240, delay = 0 }) {
  return (
    <span className="de-tilt" style={{ display: 'inline-block' }}>
      <span className="de-tilt__card" style={{ display: 'flex', flexDirection: 'column', gap: 14, width,
        padding: '26px 24px', borderRadius: 18, background: 'rgba(255,255,255,0.9)',
        border: '1px solid var(--border-subtle, #d6dce6)', boxShadow: '0 24px 60px rgba(8,22,49,0.14)',
        animationDelay: `${delay}s` }}>
        {children}
      </span>
    </span>
  );
}

/** The merged-mark blade as a section divider, with a light sweep running down it. */
export function BladeDivider({ height = 120 }) {
  return (
    <span className="de-sweep" aria-hidden="true" style={{ display: 'inline-block', width: height * 0.26, height }}>
      <svg viewBox="0 0 46 130" width="100%" height="100%">
        <defs>
          <linearGradient id="deBladeDiv" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0" stopColor="var(--de-blue-500, #0080e8)" />
            <stop offset="0.5" stopColor="var(--de-teal-500, #0b8f92)" />
            <stop offset="1" stopColor="var(--de-green-500, #00ac29)" />
          </linearGradient>
        </defs>
        <path d="M35.5 2.5 43 7.5 12.5 127.5 5 122.5Z" fill="url(#deBladeDiv)" />
      </svg>
    </span>
  );
}
