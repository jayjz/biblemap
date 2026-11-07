import type { ReactNode } from 'react';
import { THOMAS_SOURCES } from '@/content/thomas';
import styles from './thomas.module.css';

export function thomasSource(id: string) {
  const source=THOMAS_SOURCES.find(s=>s.id===id);
  if(!source) throw new Error(`Unknown Thomas source ${id}`);
  return source;
}
export function SourceReference({ id, children }: { id:string; children?:ReactNode }) {
  const source=thomasSource(id);
  return <a href={source.url}>{children??source.title}</a>;
}
export function SourceLinks({ ids, concise=false }: { ids:readonly string[]; concise?:boolean }) {
  return <span className={styles.sourceLinks}>{ids.map(id=>{const source=thomasSource(id);return <a key={id} href={source.url}>{source.title}{!concise&&` · ${source.locator}`}</a>;})}</span>;
}
