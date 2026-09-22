export const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Customer Interaction & Audit Report</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #f8fafc;
      color: #1e293b;
      margin: 0;
      padding: 2rem;
    }
    .card {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    h1 { margin-top: 0; font-size: 1.5rem; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #e2e8f0; font-size: 0.875rem; }
    th { background: #f1f5f9; color: #475569; }
    .badge { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; background: #e0f2fe; color: #0369a1; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Session Audit Log</h1>
    <p>Records sorted in chronological sequence from session initialization to completion.</p>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Chronological Timestamp</th>
          <th>Event Description</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody id="audit-table-body">
        <!-- Rendered chronologically by script below -->
      </tbody>
    </table>
  </div>

  <!-- Primary Configuration Script Block -->
  <script type="text/javascript">
    // Primary locale definition for formatted outputs
    const locale = "en-US";

    // Standard DateTime formatting configuration
    const dateTimeOptions = {
      timeZone: "UTC",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    };

    // Chronological event feed
    const auditEvents = [
      { id: "EVT-101", timestamp: "2026-09-22T08:15:30Z", description: "Secure Gateway Handshake", status: "OK" },
      { id: "EVT-102", timestamp: "2026-09-22T10:45:12Z", description: "Authentication Token Issued", status: "OK" },
      { id: "EVT-103", timestamp: "2026-09-22T14:30:00Z", description: "Batch File Export Dispatched", status: "OK" },
      { id: "EVT-104", timestamp: "2026-09-22T18:05:44Z", description: "Session Gracefully Terminated", status: "COMPLETE" }
    ];
  </script>

  <!-- Secondary Execution Script Block (Preserving strict execution order) -->
  <script>
    (function renderTable() {
      const formatter = new Intl.DateTimeFormat(locale, dateTimeOptions);
      const tbody = document.getElementById("audit-table-body");
      if (!tbody) return;

      auditEvents.forEach(evt => {
        const row = document.createElement("tr");
        const dateObj = new Date(evt.timestamp);
        const formattedDate = formatter.format(dateObj);

        row.innerHTML = '<td>' + evt.id + '</td>' +
                        '<td><strong>' + formattedDate + '</strong></td>' +
                        '<td>' + evt.description + '</td>' +
                        '<td><span class="badge">' + evt.status + '</span></td>';
        tbody.appendChild(row);
      });
      console.log("Audit log rendered with locale:", locale, "and timezone:", dateTimeOptions.timeZone);
    })();
  </script>
</body>
</html>
`;
