import Link from "next/link";
import { homeInvitation } from "@/content/home-editorial";
import type { HomeDestination } from "@/domain/home-curation";
import styles from "./archive.module.css";

export function Arrow() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 13 13 3M3 3h10v10" stroke="currentColor" strokeWidth="1.3" /></svg>;
}

export function Invitation({ entry, hero = false }: { entry: HomeDestination; hero?: boolean }) {
  const copy = homeInvitation(entry.id);
  const Heading = hero ? "h2" : "h3";
  return <div className={styles.invitation}>
    <p className={styles.kind}>{copy.name}<span>{copy.kind}</span></p>
    <Heading id={`${entry.id}-invitation-title`}>{copy.title}</Heading>
    <p className={styles.invitationText}>{copy.text}</p>
    <p className={styles.setting}>{copy.setting}</p>
    <Link prefetch={false} href={entry.href} className={styles.enter} data-home-entry={entry.id}>{copy.action}<Arrow /></Link>
    <a className={styles.sourceLink} aria-label={`${copy.locator} · sources for ${copy.name}`} href={entry.id === "jonah" ? "/human-story/jonah/#sources-title" : `${entry.href}#${entry.id === "pliny" ? "pliny-sources" : entry.id === "perpetua" ? "ending-research" : "thomas-sources"}`}>{copy.locator}</a>
  </div>;
}
