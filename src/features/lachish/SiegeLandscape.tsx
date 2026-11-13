import { useId } from "react";
import type { FeatureId } from "@/content/lachish/narrative";

/** Original relational diagram. All geometry is illustrative, never survey data. */
export function SiegeLandscape({ feature }: { feature: FeatureId }) {
  const prefix = useId();
  return <svg className="lachish-landscape" viewBox="0 0 1000 660" role="img" aria-labelledby={`${prefix}-title ${prefix}-description`} data-feature={feature}>
    <title id={`${prefix}-title`}>How a ramp changes a siege</title>
    <desc id={`${prefix}-description`}>An original schematic shows a stone ramp ascending from the left to a fortified mound on the right. A covered siege engine approaches the wall. Behind the wall an internal counter-ramp reinforces the slope. Shapes, positions and proportions are hypothetical, not measured archaeology.</desc>
    <defs>
      <linearGradient id={`${prefix}-ground`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#777354"/><stop offset="1" stopColor="#2a3026"/></linearGradient>
      <linearGradient id={`${prefix}-stone`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#dfcfa9"/><stop offset="1" stopColor="#807b61"/></linearGradient>
      <linearGradient id={`${prefix}-ramp`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d7b574"/><stop offset="1" stopColor="#756542"/></linearGradient>
      <pattern id={`${prefix}-ramp-stones`} width="22" height="16" patternUnits="userSpaceOnUse"><path d="M2 9l5-6 10 3 3 7-11 1z" fill="none" stroke="#eee1bd" strokeOpacity=".22"/></pattern>
      <pattern id={`${prefix}-masonry`} width="65" height="36" patternUnits="userSpaceOnUse"><path d="M0 0H65V36H0zM32 0V17M0 17H65M12 17V36" fill="none" stroke="#403f32" strokeOpacity=".25"/></pattern>
    </defs>
    <path d="M0 260Q130 140 300 244T620 176T1000 220V660H0Z" fill="#343a2c" opacity=".5"/>
    <path d="M0 363Q170 246 320 336T690 239T1000 290V660H0Z" fill="#424634" opacity=".6"/>
    <path d="M0 561L154 501 317 471 466 396 594 340 820 390 1000 531V660H0Z" fill={`url(#${prefix}-ground)`}/>
    <path d="M303 471L571 309 803 354 935 479 751 589Z" fill="#53553d"/>
    <path d="M571 309L803 354 935 479 750 589 793 406Z" fill="#3a4130"/>
    <g className="landscape-defense">
      <path d="M553 291L682 222 843 266 710 341Z" fill="#d4c8a5"/>
      <path d="M553 291V178L682 109V222Z" fill={`url(#${prefix}-stone)`}/>
      <path d="M682 109L843 153V266L682 222Z" fill="#918d71"/>
      <path d="M553 291V178L682 109V222Z" fill={`url(#${prefix}-masonry)`}/>
      <path d="M682 109L843 153V266L682 222Z" fill={`url(#${prefix}-masonry)`}/>
      <path d="M553 178V155L575 143V166L597 154V131L619 119V142L641 130V107L663 95V118L682 109V86L706 93V116L732 123V100L758 107V130L784 137V114L810 121V144L843 153" fill="none" stroke="#d6c7a5" strokeWidth="12"/>
      <path d="M716 299L789 220 883 371Z" fill="#7e7856" stroke="#b1a482" strokeDasharray="5 6"/>
    </g>
    <g className="landscape-ramp">
      <path d="M83 524L549 248 600 277 222 588Z" fill={`url(#${prefix}-ramp)`}/>
      <path d="M83 524L549 248 600 277 222 588Z" fill={`url(#${prefix}-ramp-stones)`}/>
      <path d="M222 588L600 277 601 322 270 623Z" fill="#776449"/>
      <path d="M119 516L548 260M163 541L578 278" fill="none" stroke="#f0d7a4" strokeWidth="2" strokeOpacity=".6"/>
    </g>
    <g className="landscape-engine" transform="translate(376 346) rotate(-32)">
      <ellipse cx="40" cy="70" rx="65" ry="15" fill="#0c100b" opacity=".45"/>
      <path d="M-20 40V-35L73-35 105 20V40Z" fill="#9e8761" stroke="#d5c2a0" strokeWidth="3"/>
      <path d="M-20-35L0-55 87-55 73-35Z" fill="#d8c39a"/>
      <path d="M73-35L87-55 116 0 105 20Z" fill="#6c644c"/>
      <path d="M-6-20H67M-6 0H76M-6 20H91M13-33V38M38-33V38M61-33V38" fill="none" stroke="#d6c2a0" strokeWidth="2" opacity=".5"/>
      <path d="M55-9L163-9" stroke="#443c2b" strokeWidth="11"/><path d="M151-15L169-9 151-3" fill="#b6b09b"/>
      <circle cx="2" cy="45" r="17" fill="#383c2c" stroke="#ccb58b" strokeWidth="5"/><circle cx="83" cy="45" r="17" fill="#383c2c" stroke="#ccb58b" strokeWidth="5"/>
    </g>
    <g fill="#e9dfc9" fontFamily="system-ui, sans-serif" fontSize="16" letterSpacing="2">
      <path d="M262 580L166 625H85M466 304L366 214H245M748 158L858 91H951" fill="none" stroke="#bda371"/>
      <text x="85" y="650">01 / STONE RAMP</text><text x="130" y="199">02 / SIEGE ENGINE</text><text x="781" y="74">03 / DEFENSES</text>
    </g>
    <g fill="#c6bda6" fontFamily="system-ui, sans-serif" fontSize="14"><text x="777" y="422">Internal counter-ramp</text><text x="60" y="70">LACHISH / SOUTHWEST ASSAULT AREA</text><text x="60" y="96">Relational schematic · not to scale</text></g>
  </svg>;
}
