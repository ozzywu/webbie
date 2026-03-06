"use client";

import { useState } from "react";

export function SetupContent({
  token,
  siteUrl,
}: {
  token: string;
  siteUrl: string;
}) {
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const bookmarkletCode = `javascript:void(fetch('${siteUrl}/api/bookmark',{method:'POST',headers:{'Authorization':'Bearer ${token}','Content-Type':'application/json'},body:JSON.stringify({url:location.href})}).then(r=>r.json()).then(d=>{if(d.success){alert((d.duplicate?'Already saved: ':'Saved: ')+(d.title||'bookmark'))}else{alert('Error: '+(d.error||'unknown'))}}).catch(()=>alert('Failed to save')))`;

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  const font = "var(--font-geist-sans), system-ui, sans-serif";

  return (
    <div style={{ fontFamily: font }}>
      <style>{SETUP_STYLES}</style>

      <h1 className="setup-heading">Capture Tools</h1>
      <p className="setup-subtitle">
        Set up bookmarklet and shortcuts to save articles and notes from anywhere.
      </p>

      {/* Bookmarklet */}
      <section className="setup-section">
        <h2 className="setup-section-title">Bookmarklet — Desktop</h2>
        <p className="setup-desc">
          Drag this button to your bookmark bar. Click it on any page to save the
          article to your bookmarks inbox.
        </p>

        <div className="setup-bookmarklet-row">
          <a
            href={bookmarkletCode}
            className="setup-bookmarklet-btn"
            onClick={(e) => e.preventDefault()}
            draggable
          >
            📎 Save to Library
          </a>
          <span className="setup-hint">← Drag this to your bookmark bar</span>
        </div>

        <p className="setup-note">
          Works in Arc, Chrome, Safari, Firefox, Brave — any Chromium or
          WebKit browser.
        </p>
      </section>

      {/* iOS Shortcut */}
      <section className="setup-section">
        <h2 className="setup-section-title">iOS Shortcut — Save Link</h2>
        <p className="setup-desc">
          Create a Shortcut that appears in your iPhone&apos;s Share Sheet.
          One tap to save any article.
        </p>

        <ol className="setup-steps">
          <li>
            Open the <strong>Shortcuts</strong> app on your iPhone
          </li>
          <li>
            Tap <strong>+</strong> to create a new Shortcut
          </li>
          <li>
            Name it <strong>&quot;Save to Library&quot;</strong>
          </li>
          <li>
            Add action: <strong>Receive input</strong> from Share Sheet (accept
            URLs)
          </li>
          <li>
            Add action: <strong>Get Contents of URL</strong>
            <ul className="setup-substeps">
              <li>
                URL:{" "}
                <code>{siteUrl}/api/bookmark</code>
              </li>
              <li>Method: <code>POST</code></li>
              <li>
                Headers: <code>Authorization</code> ={" "}
                <code>Bearer {showToken ? token : "••••••••"}</code>
              </li>
              <li>
                Headers: <code>Content-Type</code> ={" "}
                <code>application/json</code>
              </li>
              <li>
                Request Body (JSON):{" "}
                <code>{`{"url": "<Shortcut Input>"}`}</code>
              </li>
            </ul>
          </li>
          <li>
            Add action: <strong>Show Notification</strong> — &quot;Saved!&quot;
          </li>
          <li>
            Toggle <strong>&quot;Show in Share Sheet&quot;</strong> on
          </li>
        </ol>
      </section>

      {/* iOS Shortcut — Quick Note */}
      <section className="setup-section">
        <h2 className="setup-section-title">iOS Shortcut — Quick Note</h2>
        <p className="setup-desc">
          Capture thoughts on the go. Tap a widget or say &quot;Hey Siri, quick
          note&quot; to dictate a note.
        </p>

        <ol className="setup-steps">
          <li>
            Create a new Shortcut named <strong>&quot;Quick Note&quot;</strong>
          </li>
          <li>
            Add action: <strong>Ask for Input</strong> — prompt: &quot;What&apos;s
            on your mind?&quot;
          </li>
          <li>
            Add action: <strong>Get Contents of URL</strong>
            <ul className="setup-substeps">
              <li>
                URL:{" "}
                <code>{siteUrl}/api/note</code>
              </li>
              <li>Method: <code>POST</code></li>
              <li>
                Headers: <code>Authorization</code> ={" "}
                <code>Bearer {showToken ? token : "••••••••"}</code>
              </li>
              <li>
                Headers: <code>Content-Type</code> ={" "}
                <code>application/json</code>
              </li>
              <li>
                Request Body (JSON):{" "}
                <code>{`{"content": "<Provided Input>"}`}</code>
              </li>
            </ul>
          </li>
          <li>
            Add action: <strong>Show Notification</strong> — &quot;Note saved!&quot;
          </li>
          <li>
            Add to Home Screen as a widget for one-tap access
          </li>
        </ol>
      </section>

      {/* Token */}
      <section className="setup-section">
        <h2 className="setup-section-title">API Token</h2>
        <p className="setup-desc">
          Use this token for any custom integrations. Keep it secret.
        </p>

        <div className="setup-token-row">
          <code className="setup-token">
            {showToken ? token : "••••••••••••••••••••••••"}
          </code>
          <button
            onClick={() => setShowToken((v) => !v)}
            className="setup-token-btn"
          >
            {showToken ? "Hide" : "Show"}
          </button>
          <button
            onClick={() => copyToClipboard(token, "token")}
            className="setup-token-btn"
          >
            {copied === "token" ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="setup-api-info">
          <p className="setup-desc" style={{ marginBottom: 8 }}>
            <strong>Endpoints:</strong>
          </p>
          <code className="setup-code-block">
            POST {siteUrl}/api/bookmark{"\n"}
            {`{ "url": "https://example.com/article" }`}
            {"\n\n"}
            POST {siteUrl}/api/note{"\n"}
            {`{ "content": "Your thought here", "title": "Optional title" }`}
          </code>
        </div>
      </section>
    </div>
  );
}

const SETUP_STYLES = `
  .setup-heading {
    font-size: 20px;
    font-weight: 500;
    color: #1a1a1a;
    margin-bottom: 4px;
  }

  .setup-subtitle {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 32px;
  }

  .setup-section {
    margin-bottom: 32px;
    padding-bottom: 32px;
    border-bottom: 1px solid #e5e5e5;
  }

  .setup-section:last-child {
    border-bottom: none;
  }

  .setup-section-title {
    font-size: 16px;
    font-weight: 500;
    color: #1a1a1a;
    margin-bottom: 6px;
  }

  .setup-desc {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.5;
    margin-bottom: 16px;
  }

  .setup-note {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 12px;
  }

  .setup-bookmarklet-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .setup-bookmarklet-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    background: #670000;
    text-decoration: none;
    cursor: grab;
    transition: opacity 0.15s;
    user-select: none;
  }

  .setup-bookmarklet-btn:hover {
    opacity: 0.85;
  }

  .setup-hint {
    font-size: 13px;
    color: #9ca3af;
  }

  .setup-steps {
    font-size: 13px;
    color: #374151;
    line-height: 1.8;
    padding-left: 20px;
    list-style-type: decimal;
  }

  .setup-steps li {
    margin-bottom: 4px;
  }

  .setup-substeps {
    font-size: 12px;
    color: #6b7280;
    padding-left: 16px;
    list-style-type: disc;
    margin-top: 4px;
  }

  .setup-steps code, .setup-substeps code {
    background: #f3f4f6;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 12px;
    font-family: var(--font-space-mono), monospace;
  }

  .setup-token-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  .setup-token {
    padding: 6px 12px;
    background: #f3f4f6;
    border-radius: 6px;
    font-size: 13px;
    font-family: var(--font-space-mono), monospace;
    color: #374151;
    letter-spacing: 0.02em;
  }

  .setup-token-btn {
    padding: 5px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 12px;
    color: #6b7280;
    background: #fff;
    cursor: pointer;
    transition: border-color 0.15s;
  }

  .setup-token-btn:hover {
    border-color: #d1d5db;
    color: #374151;
  }

  .setup-api-info {
    margin-top: 16px;
  }

  .setup-code-block {
    display: block;
    padding: 12px 16px;
    background: #1a1a1a;
    color: #e5e5e5;
    border-radius: 8px;
    font-size: 12px;
    font-family: var(--font-space-mono), monospace;
    white-space: pre;
    line-height: 1.6;
    overflow-x: auto;
  }
`;
