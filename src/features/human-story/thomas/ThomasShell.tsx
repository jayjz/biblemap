import Link from 'next/link';
import type { ReactNode } from 'react';
import { THOMAS_ROUTES } from '@/content/thomas';
import styles from './thomas.module.css';

export function ThomasShell({ children, reading = false, sayings = false }: { children: ReactNode; reading?: boolean; sayings?: boolean }) {
  return <div className={`${styles.shell} ${reading ? styles.reading : ''}`} data-thomas-shell>
    <a href="#thomas-main" className={styles.skip}>Skip to the reading</a>
    <header className={styles.header}><Link href="/human-story/" prefetch={false} className={styles.wordmark}>BibleMap<span>The human story</span></Link>
      <nav aria-label="Reading options"><Link href="/human-story/worlds/saints/" prefetch={false}>Other lives</Link>
        <Link href={reading || sayings ? THOMAS_ROUTES.encounter : THOMAS_ROUTES.reading} prefetch={false}>{reading || sayings ? 'Thomas encounter' : 'Simple reading'}</Link>
      </nav>
    </header>
    <main id="thomas-main" tabIndex={-1}>{children}</main>
    <footer className={styles.footer}><p>A source-grounded working prototype · editorial review pending.</p><Link href="/human-story/james/" prefetch={false}>Meet James</Link><Link href="/jonah/" prefetch={false}>Read Jonah</Link><a href="#thomas-main">Back to the beginning</a></footer>
  </div>;
}
