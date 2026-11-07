import styles from './thomas.module.css';

/** Original symbolic space. No historic building, supernatural figure or event is reconstructed. */
export function SpatialArtwork({ variant = 'entrance' }: { variant?: 'entrance' | 'gathering' }) {
  const wall = `${variant}-wall`;
  const floor = `${variant}-floor`;
  const grain = `${variant}-grain`;
  return <svg className={styles.spatialArt} viewBox="0 0 1000 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" data-spatial-art={variant}>
    <defs>
      <linearGradient id={wall} x1="0" x2="100%" y1="0" y2="80%"><stop stopColor={variant === 'gathering' ? '#b4a48c' : '#716049'} /><stop offset="1" stopColor="#332a20" /></linearGradient>
      <linearGradient id={floor} x1="0" x2="30%" y1="0" y2="100%"><stop stopColor="#b29a76" /><stop offset="1" stopColor="#241d16" /></linearGradient>
      <pattern id={grain} width="37" height="31" patternUnits="userSpaceOnUse"><path d="M3 7h2m15 11h1m10 9h2M8 25h1M32 4h1" stroke="#f1dfb7" strokeWidth=".7" opacity=".2" /></pattern>
    </defs>
    {variant === 'gathering' ? <>
      <path d="M0 0H1000V900H0Z" fill="#29231c" />
      <path d="M0 0L260 140H810L1000 0Z" fill="#3b3227" />
      <path d="M260 140H810V570L260 620Z" fill={`url(#${wall})`} />
      <path d="M0 0L260 140V620L0 900Z" fill="#4c4030" />
      <path d="M810 140L1000 0V900L810 570Z" fill="#352c22" />
      <path d="M260 620L810 570L1000 900H0Z" fill={`url(#${floor})`} />
      <path d="M275 149H797V158H275Z" fill="#d2bf9b" />
      <path d="M85 246L193 281V680L85 770Z" fill="#211b15" />
      <path d="M85 246L193 281V680L85 770Z" fill="none" stroke="#7a6549" strokeWidth="3" />
      <path d="M194 280V680" stroke="#a08a65" opacity=".45" />
      <path d="M0 900L470 600M360 900L550 596M700 900L670 582M0 780L1000 725" stroke="#4f4231" strokeWidth="2" />
      <path d="M260 620L810 570L920 750L100 800Z" fill="#e3d2a8" opacity=".11" />
    </> : <>
    <path d="M0 0H1000V900H0Z" fill="#17130f" />
    <path d="M230 0H1000V550L230 660Z" fill={`url(#${wall})`} />
    <path d="M230 660L1000 550V900H0Z" fill={`url(#${floor})`} />
    <path d="M230 0V660L0 900V0Z" fill="#292218" />
    <path d="M620 135H790V580L620 604Z" fill="#12110e" />
    <path d="M620 135H790L777 148H632V602L620 604Z" fill="#44382a" />
    <path d="M779 148H790V580L779 582Z" fill="#e7d7b4" />
    <path d="M779 582L920 900H470L790 580Z" fill="#ddcba4" opacity=".18" />
    <path d="M0 710L230 630M0 810L230 650M210 900L525 617M530 900L681 594M850 900L815 576" stroke="#30271e" strokeWidth="2" />
    <path d="M230 660L1000 550M0 810L1000 670M0 900L1000 820" stroke="#c0aa80" opacity=".14" />
    </>}
    <path d="M0 0H1000V900H0Z" fill={`url(#${grain})`} />
  </svg>;
}
