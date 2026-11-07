import type { JamesMovementId, JamesWitnessId } from "@/content/james";
import styles from "./james.module.css";

/** Original symbolic composition. Sheets and marks are neither artifacts nor a city reconstruction. */
export function Palimpsest({ movement = "brother", witness }: { movement?: JamesMovementId; witness?: JamesWitnessId }) {
  return <div className={styles.palimpsest} data-movement={movement} data-witness={witness ?? "all"} aria-hidden="true">
    <svg viewBox="0 0 720 800" fill="none" focusable="false">
      <g className={styles.horizon} stroke="currentColor" strokeWidth="1">
        <path d="M-50 580Q130 400 350 545T780 460M-50 610Q130 430 350 575T780 490M-50 640Q130 460 350 605T780 520M-50 670Q130 490 350 635T780 550M-50 700Q130 520 350 665T780 580M-50 730Q130 550 350 695T780 610M-50 760Q130 580 350 725T780 640" />
      </g>
      <g className={`${styles.leaf} ${styles.markLeaf}`}>
        <path d="M132 225L439 143L582 642L260 730Z" fill="#798dab" />
        <path d="M158 252L430 180M168 277L440 205M179 310L449 238M190 340L459 268M201 370L467 298M213 402L479 330M227 440L489 368M240 478L501 406M252 516L513 444M266 557L524 485M278 594L534 522M287 625L546 553" stroke="#201e29" strokeWidth="3" opacity=".35" />
      </g>
      <g className={`${styles.leaf} ${styles.actsLeaf}`}>
        <path d="M278 121L590 213L502 723L178 621Z" fill="#b4a9c3" />
        <path d="M300 165L555 242M292 195L550 272M285 225L544 302M278 255L539 332M271 285L534 362M264 315L528 392M257 345L522 422M250 375L516 452M243 405L509 482M236 435L503 512M229 465L497 542M222 495L491 572M215 525L485 602M208 555L479 632" stroke="#201e29" strokeWidth="2" opacity=".3" />
      </g>
      <g className={`${styles.leaf} ${styles.memoryLeaf}`}>
        <path d="M338 89L653 324L396 676L105 475Z" stroke="#c5a778" strokeWidth="2" />
        <path d="M343 110L626 326L391 651L132 472Z" stroke="#c5a778" strokeWidth=".8" />
        <path d="M393 172L568 305M368 203L544 337M345 234L521 368M322 266L498 400M299 297L475 431M276 328L452 462M253 359L429 493M230 390L406 524M207 422L383 555" stroke="#c5a778" strokeWidth="1" />
      </g>
      <g className={`${styles.leaf} ${styles.paulLeaf}`}>
        <path d="M202 178L510 168L532 653L199 670L211 478L187 403Z" fill="#f0e7d6" />
        <path d="M223 212L482 204M222 229L483 221M221 246L484 238M220 263L485 255" stroke="#8c7b6c" strokeWidth="1" />
        <text x="231" y="348" fill="#302b30" fontFamily="Georgia, serif" fontSize="64">James</text>
        <path d="M224 393L483 385M223 410L484 402M224 427L485 419M224 444L486 436M223 461L487 453M223 478L488 470M223 495L489 487M222 512L490 504M222 529L491 521M221 546L492 538M221 563L493 555M221 580L494 572M221 597L495 589M220 614L496 606" stroke="#8c7b6c" strokeWidth="1" />
        <path className={styles.erasure} d="M220 395L488 387L495 538L219 546Z" fill="#f0e7d6" />
      </g>
      <g className={`${styles.leaf} ${styles.josephusLeaf}`}>
        <path d="M153 465L554 438L580 550L379 544L365 570L173 596Z" fill="#c5a778" />
        <text x="197" y="522" fill="#302b30" fontFamily="Georgia, serif" fontSize="29">whose name was James</text>
      </g>
      <path className={styles.fracture} d="M358 140L345 324L378 403L353 488L366 691" stroke="#201e29" strokeWidth="18" />
      <g className={styles.aperture}>
        <path d="M285 649V381A75 75 0 0 1 435 381V649" fill="#201e29" />
        <path d="M282 646V381A78 78 0 0 1 438 381V646" stroke="#c5a778" strokeWidth="1" />
      </g>
      <path d="M95 742H625" stroke="#c5a778" opacity=".35" />
    </svg>
  </div>;
}
