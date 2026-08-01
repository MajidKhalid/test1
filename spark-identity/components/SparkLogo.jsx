import './spark-logo.css';
import deWordmarkNavy from '../brand/logos/de-wordmark-navy.png';
import deWordmarkWhite from '../brand/logos/de-wordmark-white.png';

const SPARK_PATH = 'M32 1c2.1 17.6 11.3 28.3 31 31-19.7 2.7-28.9 13.4-31 31-2.1-17.6-11.3-28.3-31-31 19.7-2.7 28.9-13.4 31-31Z';
const BLADE_PATH = 'M35.5 2.5 43 7.5 12.5 127.5 5 122.5Z';

export function SparkGlyph({ size = 32, mono }) {
  const id = 'sparkGrad';
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      {!mono && (
        <defs>
          <linearGradient id={id} x1="0.1" y1="1" x2="0.9" y2="0">
            <stop offset="0" stopColor="#e85a30" />
            <stop offset="0.55" stopColor="#ff734a" />
            <stop offset="1" stopColor="#dfc28c" />
          </linearGradient>
        </defs>
      )}
      <path d={SPARK_PATH} fill={mono || `url(#${id})`} />
    </svg>
  );
}

/** Primary product mark. size = wordmark cap size in px (min 20). */
export function SparkLockup({ size = 40, inverse = false }) {
  return (
    <span className={'spark-lockup' + (inverse ? ' spark-lockup--inverse' : '')} style={{ fontSize: size }}>
      <SparkGlyph size={size * 0.8} />
      <span className="spark-lockup__word">SPARK</span>
    </span>
  );
}

/** Merged mark: SPARK / طاقتنا رقمية, split by the gradient blade. */
export function SparkDigitalEnergyLockup({ size = 40, inverse = false }) {
  return (
    <span className="spark-de" style={{ fontSize: size }} role="img"
          aria-label="SPARK — a Digital Energy product">
      <span className="spark-de__spark"><SparkLockup size={size} inverse={inverse} /></span>
      <svg className="spark-de__blade" viewBox="0 0 46 130" aria-hidden="true">
        <defs>
          <linearGradient id="bladeGrad" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0" stopColor="#ff734a" />
            <stop offset="0.45" stopColor="#0b8f92" />
            <stop offset="1" stopColor="#00ac29" />
          </linearGradient>
        </defs>
        <path d={BLADE_PATH} fill="url(#bladeGrad)" />
      </svg>
      <img className="spark-de__de" alt="" src={inverse ? deWordmarkWhite : deWordmarkNavy} />
    </span>
  );
}
