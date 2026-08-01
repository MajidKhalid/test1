import './floating-artifacts.css';
import { useEffect, useRef } from 'react';
import motifCircle from '../brand/motifs/motif-circle-teal.png';
import motifDiamond from '../brand/motifs/motif-diamond-blue.png';
import motifSquareOrange from '../brand/motifs/motif-square-orange.png';
import motifSquareSky from '../brand/motifs/motif-square-skyblue.png';

export const MOTIFS = { circle: motifCircle, diamond: motifDiamond, roundedSquare: motifSquareOrange, square: motifSquareSky };

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Sky-blue glass cube — the square tile extruded. size in px. */
export function SolidCube({ size = 110, shadow = true }) {
  const h = size / 2;
  const faces = [
    `rotateY(0deg) translateZ(${h}px)`, `rotateY(90deg) translateZ(${h}px)`,
    `rotateY(180deg) translateZ(${h}px)`, `rotateY(270deg) translateZ(${h}px)`,
    `rotateX(90deg) translateZ(${h}px)`, `rotateX(-90deg) translateZ(${h}px)`,
  ];
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.28 }} aria-hidden="true">
      <span className="de-solid" style={{ width: size, height: size, perspective: 'none' }}>
        <span className="de-solid__spin de-cube">
          {faces.map((t, i) => (
            <span key={i} className="de-cube__face" style={{ transform: t, backgroundImage: `url(${motifSquareSky})`, opacity: 0.94 }} />
          ))}
        </span>
      </span>
      {shadow && <span className="de-shadow" style={{ width: size * 1.1, height: size * 0.22 }} />}
    </span>
  );
}

/** Deep-blue octahedron — the diamond tile made volumetric. size = base edge px. */
export function SolidOcta({ size = 116, shadow = true }) {
  const fh = size * 0.866, ph = size / Math.SQRT2, total = ph * 2;
  const alpha = [0.98, 0.9, 0.82, 0.94];
  const Face = ({ k, dim }) => (
    <span className="de-octa__seat" style={{
      width: size, height: fh, marginTop: -fh,
      transform: `rotateY(${k * 90}deg) translateZ(${size / 2}px) rotateX(35.264deg)`,
    }}>
      <span className="de-octa__face" style={{ opacity: alpha[k] * (dim ? 0.86 : 1) }} />
    </span>
  );
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.24 }} aria-hidden="true">
      <span className="de-solid" style={{ width: size, height: total }}>
        <span className="de-solid__spin de-octa">
          <span className="de-octa__half">{[0, 1, 2, 3].map(k => <Face key={k} k={k} />)}</span>
          <span className="de-octa__half de-octa__half--bottom">{[0, 1, 2, 3].map(k => <Face key={k} k={k} dim />)}</span>
        </span>
      </span>
      {shadow && <span className="de-shadow" style={{ width: size, height: size * 0.2 }} />}
    </span>
  );
}

/** Teal orbital sphere — the circle tile as a wireframe gyroscope. */
export function GyroSphere({ size = 128, shadow = true }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.22 }} aria-hidden="true">
      <span className="de-solid" style={{ width: size, height: size }}>
        <span className="de-solid__spin de-gyro">
          {[0, 45, 90, 135].map(a => (
            <span key={a} className={'de-gyro__ring' + (a % 90 ? ' de-gyro__ring--faint' : '')} style={{ transform: `rotateY(${a}deg)` }} />
          ))}
          <span className="de-gyro__ring" style={{ transform: 'rotateX(90deg)', borderColor: 'rgba(111,210,208,.75)' }} />
          <span className="de-gyro__core" style={{ width: size * 0.4, height: size * 0.4 }} />
        </span>
      </span>
      {shadow && <span className="de-shadow" style={{ width: size * 0.9, height: size * 0.18 }} />}
    </span>
  );
}

/** Orange floating stack — three rounded tiles hovering apart in isometric space. */
export function MotifStack({ size = 130, gap = 36, shadow = true }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }} aria-hidden="true">
      <span className="de-solid de-stack" style={{ width: size * 1.5, height: size * 1.5 }}>
        <span className="de-stack__tilt">
          {[-1, 0, 1].map(k => (
            <span key={k} className="de-stack__layer" style={{ transform: `translateZ(${k * gap}px)` }}>
              <img src={motifSquareOrange} alt="" style={{ animationDelay: `${k * -2.6}s`, opacity: 1 - Math.abs(k) * 0.14 }} />
            </span>
          ))}
        </span>
      </span>
      {shadow && <span className="de-shadow" style={{ width: size * 1.15, height: size * 0.22, marginTop: -size * 0.1 }} />}
    </span>
  );
}

/** The SPARK orb as a glass object: shading, specular, halo, breath. */
export function GlassOrb({ size = 72 }) {
  return (
    <span className="de-orb3d" style={{ width: size, height: size }} aria-hidden="true">
      <span className="de-orb3d__halo" />
      <span className="de-orb3d__spec" />
    </span>
  );
}

/**
 * Cursor-parallax scene. Children marked data-depth="0.02…0.12" drift against
 * the pointer (spatial depth: far = small depth, near = large). Reduced-motion safe.
 */
export function ParallaxScene({ children, strength = 100, style, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const layers = [...el.querySelectorAll('[data-depth]')];
    let tx = 0, ty = 0, cx = 0, cy = 0, raf;
    const onMove = e => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => { tx = 0; ty = 0; };
    const tick = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      for (const l of layers) {
        const d = parseFloat(l.dataset.depth) || 0;
        l.style.transform = `translate3d(${(-cx * d * strength).toFixed(2)}px, ${(-cy * d * strength).toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => { el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave); cancelAnimationFrame(raf); };
  }, [strength]);
  return <div ref={ref} className={'de-parallax ' + className} style={style}>{children}</div>;
}

/** The merged-mark blade as a divider with a light sweep. */
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

/** Aurora wash backdrop — three drifting DE blobs. Put inside a position:relative section. */
export function AuroraBackdrop() {
  return (
    <div className="de-bg" aria-hidden="true">
      <span className="de-bg-aurora__b de-bg-aurora__b--teal" style={{ width: 420, height: 420, left: '-8%', top: '-30%' }} />
      <span className="de-bg-aurora__b de-bg-aurora__b--blue" style={{ width: 480, height: 480, right: '-12%', top: '-16%' }} />
      <span className="de-bg-aurora__b de-bg-aurora__b--gold" style={{ width: 320, height: 320, left: '36%', bottom: '-38%' }} />
    </div>
  );
}

/** Great orbits — ring lines wheeling around an off-screen centre (default: top right). */
export function OrbitLines() {
  return (
    <div className="de-bg" aria-hidden="true">
      <span className="de-bg-orbit" style={{ width: 700, height: 700, right: -320, top: -220 }}>
        <span className="de-bg-orbit__sat" />
      </span>
      <span className="de-bg-orbit de-bg-orbit--blue de-bg-orbit--rev" style={{ width: 520, height: 520, right: -230, top: -120, animationDuration: '42s' }}>
        <span className="de-bg-orbit__sat de-bg-orbit__sat--blue" />
      </span>
      <span className="de-bg-orbit de-bg-orbit--dashed" style={{ width: 380, height: 380, right: -160, top: -40, animationDuration: '80s' }} />
    </div>
  );
}

/** Rising embers — the four tiles drifting up, barely there. count spreads them across the width. */
export function EmberField({ count = 6 }) {
  const names = ['roundedSquare', 'circle', 'diamond', 'square'];
  return (
    <div className="de-bg" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <img key={i} className="de-bg-ember" src={MOTIFS[names[i % 4]]} alt=""
             style={{ left: (8 + (i * 83) % 88) + '%', width: 16 + (i * 7) % 18,
                      animationDuration: (13 + (i * 2.7) % 7) + 's', animationDelay: (i * -3.1) + 's' }} />
      ))}
    </div>
  );
}

/** Blade streaks — several rare light passes. Use sparingly (loading, transitions, footers). */
export function BladeStreaks({ count = 4 }) {
  const mods = ['', ' de-bg-streak--blue', ' de-bg-streak--sky', ''];
  return (
    <div className="de-bg" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={'de-bg-streak' + mods[i % 4]}
              style={{ left: (6 + (i * 26) % 60) + '%', top: (28 + (i * 22) % 50) + '%',
                       width: 110 + (i * 37) % 70, animationDuration: (6.5 + (i % 3) * 1.6) + 's', animationDelay: (i * -2.4) + 's' }} />
      ))}
    </div>
  );
}

/** Section breaker — a hairline seam worked by one figure.
    variant: 'keystone' (octahedron holds the centre) | 'wire' (embers lift off the rule)
           | 'metronome' (cube quarter-tumbles). dark = navy sections. */
export function SectionBreak({ variant = 'metronome', dark = false, height = 110 }) {
  const split = variant !== 'wire';
  let figure = null;
  if (variant === 'metronome') {
    const t = ['rotateY(0deg)', 'rotateY(90deg)', 'rotateY(180deg)', 'rotateY(270deg)', 'rotateX(90deg)', 'rotateX(-90deg)'];
    figure = (
      <span style={{ display: 'inline-block', width: 30, height: 30 }}>
        <span className="de-solid__spin de-break__tumble">
          {t.map(x => <span key={x} className="de-cube__face" style={{ transform: x + ' translateZ(15px)', backgroundImage: 'url(' + motifSquareSky + ')' }} />)}
        </span>
      </span>
    );
  }
  if (variant === 'keystone') {
    const size = 34, fh = size * 0.866, alpha = [0.98, 0.9, 0.82, 0.94];
    const half = (dim) => [0, 1, 2, 3].map(k => (
      <span key={k} className="de-octa__seat" style={{ width: size, height: fh, marginTop: -fh,
        transform: 'rotateY(' + k * 90 + 'deg) translateZ(' + size / 2 + 'px) rotateX(35.264deg)' }}>
        <span className="de-octa__face" style={{ opacity: alpha[k] * (dim ? 0.86 : 1) }} />
      </span>
    ));
    figure = (
      <span style={{ display: 'inline-block', width: size, height: size * Math.SQRT2 }}>
        <span className="de-solid__spin de-octa" style={{ animationDuration: '18s' }}>
          <span className="de-octa__half">{half(false)}</span>
          <span className="de-octa__half de-octa__half--bottom">{half(true)}</span>
        </span>
      </span>
    );
  }
  if (variant === 'wire') {
    const e = [
      { m: 'roundedSquare', left: '18%', w: 13, dur: '5s', del: '0s' },
      { m: 'circle', left: '37%', w: 10, dur: '6.5s', del: '-2.2s' },
      { m: 'diamond', left: '58%', w: 12, dur: '5.8s', del: '-4.1s' },
      { m: 'square', left: '76%', w: 9, dur: '7.2s', del: '-1.3s' },
    ];
    figure = e.map((x, i) => (
      <img key={i} className="de-break__ember" src={MOTIFS[x.m]} alt=""
           style={{ left: x.left, width: x.w, animationDuration: x.dur, animationDelay: x.del }} />
    ));
  }
  return (
    <div className={'de-break' + (dark ? ' de-break--dark' : '')} style={{ height }} aria-hidden="true">
      {split ? <><span className="de-break__line de-break__line--l" /><span className="de-break__line de-break__line--r" /></> : <span className="de-break__line" />}
      {figure}
    </div>
  );
}
