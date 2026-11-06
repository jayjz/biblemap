import styles from './cinema.module.css';
export function CinematicDisclosure({ figures = false }: { figures?: boolean }) {
  return <details className={styles.disclosure}><summary>{figures ? 'AI-generated environment · anonymous figures' : 'AI-generated interpretive environment'}</summary>
    <p>{figures ? 'Anonymous invented figures, not Thomas, Jesus or identified eyewitnesses. ' : ''}The architecture, furnishings, light and viewpoint are imagined. This artwork does not reconstruct an appearance, conversation or act of touching.</p>
    <a href="#art-provenance">Material references and full provenance</a>
  </details>;
}
