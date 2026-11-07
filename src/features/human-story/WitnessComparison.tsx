import Link from "next/link";
import styles from "./human-story.module.css";

const accounts = [
  {
    id: "tacitus",
    name: "Tacitus",
    passage: "Annals 15.44",
    subject: "Christus, Nero and punishment at Rome",
    boundary: "Hostile retrospective account; information source not named.",
  },
  {
    id: "pliny",
    name: "Pliny & Trajan",
    passage: "Letters 10.96–97",
    subject: "A governor's procedure and reported worship",
    boundary:
      "Interrogations and coercion; not an account of Jesus's lifetime.",
  },
  {
    id: "josephus-james",
    name: "Josephus: James",
    passage: "Antiquities 20.200",
    subject: "James's death and Ananus's authority",
    boundary: "A brief notice in political history; distinguish book 18.",
  },
  {
    id: "testimonium",
    name: "The Testimonium",
    passage: "Antiquities 18.63–64",
    subject: "The received passage about Jesus",
    boundary:
      "Wording and transmission disputed; no uncontested resurrection proof.",
  },
  {
    id: "suetonius",
    name: "Suetonius",
    passage: "Claudius 25.4",
    subject: "Disturbances and expulsion from Rome",
    boundary: "The identification of Chrestus is disputed.",
  },
];

export function WitnessComparison() {
  return (
    <div className={styles.comparison}>
      <h2>Ask a different question of each source.</h2>
      <div
        className={styles.tableWrap}
        role="region"
        aria-label="Compare ancient accounts; scroll horizontally on small screens"
        tabIndex={0}
      >
        <table>
          <caption>
            What is being reported, and where the evidence stops
          </caption>
          <thead>
            <tr>
              <th scope="col">Account</th>
              <th scope="col">Its subject</th>
              <th scope="col">Its limits</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <th scope="row">
                  <Link prefetch={false} href={`/human-story/${account.id}/`}>
                    {account.name}
                  </Link>
                  <small>{account.passage}</small>
                </th>
                <td>{account.subject}</td>
                <td>{account.boundary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
