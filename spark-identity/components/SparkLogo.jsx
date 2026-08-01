import './spark-logo.css';
import deWordmarkNavy from '../brand/logos/de-wordmark-navy.png';
import deWordmarkWhite from '../brand/logos/de-wordmark-white.png';

const BLADE_PATH = 'M35.5 2.5 43 7.5 12.5 127.5 5 122.5Z';

/** The Digital Energy gradient orb — SPARK's full stop. Sized in em by its parent. */
export function SparkOrb({ className = '' }) {
  return <span className={'spark-orb ' + className} aria-hidden="true" />;
}

/**
 * Primary product mark.
 * size = wordmark font-size in px (min 20). Sub-label is dropped below 30px.
 */
export function SparkLockup({ size = 40, inverse = false, sublabel = false }) {
  const mark = (
    <span className={'spark-lockup' + (inverse ? ' spark-lockup--inverse' : '')} style={{ fontSize: size }}>
      <span className="spark-lockup__word">SPARK</span>
      <SparkOrb />
    </span>
  );
  if (!sublabel || size < 30) return mark;
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', fontSize: size }}>
      {mark}
      <span className="spark-sublabel">A DIGITAL ENERGY INITIATIVE</span>
    </span>
  );
}

function Blade() {
  return (
    <svg className="spark-de__blade" viewBox="0 0 46 130" aria-hidden="true">
      <defs>
        <linearGradient id="sparkBlade" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="var(--de-blue-500, #0080e8)" />
          <stop offset="0.5" stopColor="var(--de-teal-500, #0b8f92)" />
          <stop offset="1" stopColor="var(--de-green-500, #00ac29)" />
        </linearGradient>
      </defs>
      <path d={BLADE_PATH} fill="url(#sparkBlade)" />
    </svg>
  );
}

/**
 * Merged mark: SPARK / طاقتنا رقمية.
 * variant "slash" (default) splits the two halves with the gradient blade;
 * variant "hinge" lets the single orb serve as the join between them.
 */
export function SparkDigitalEnergyLockup({ size = 40, inverse = false, variant = 'slash' }) {
  const hinge = variant === 'hinge';
  return (
    <span className={'spark-de' + (hinge ? ' spark-de--hinge' : '')} style={{ fontSize: size }}
          role="img" aria-label="SPARK — a Digital Energy initiative">
      <span className="spark-de__spark">
        <span className={'spark-lockup' + (inverse ? ' spark-lockup--inverse' : '')} style={{ fontSize: size }}>
          <span className="spark-lockup__word">SPARK</span>
          {!hinge && <SparkOrb />}
        </span>
      </span>
      {hinge ? <SparkOrb /> : <Blade />}
      <img className="spark-de__de" alt="" src={inverse ? deWordmarkWhite : deWordmarkNavy} />
    </span>
  );
}
