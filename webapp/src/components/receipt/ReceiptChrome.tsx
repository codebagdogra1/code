import { formatDate } from "@/lib/format";

// Masthead shared by both receipts: CODE wordmark + org line on the left, the
// receipt kind plate with its serial number and date on the right.
export function ReceiptMasthead({
  kind,
  serial,
  date,
}: {
  kind: string;
  serial: string;
  date: string | null;
}) {
  return (
    <header className="receipt-masthead">
      <div>
        <div className="receipt-wordmark">CODE</div>
        <p className="receipt-orgline">Computer &amp; Digital Excellence · Bagdogra, West Bengal</p>
      </div>
      <div className="text-right">
        <span className="receipt-kind">{kind}</span>
        <div className="receipt-serial">{serial}</div>
        <div className="receipt-serial-date">{formatDate(date)}</div>
      </div>
    </header>
  );
}

// Foot shared by both receipts: authorised-signature line and a note that the
// document is computer-generated.
export function ReceiptFoot() {
  return (
    <footer className="receipt-foot">
      <div className="receipt-sign">Authorised signature</div>
      <p className="receipt-note">
        Computer-generated receipt — valid without signature. Please retain for your records.
      </p>
    </footer>
  );
}
