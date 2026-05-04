export default function DiscordCTA({ serverInviteUrl }: { serverInviteUrl: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "16px 20px",
      border: "1px solid #EBEBEB",
      borderRadius: "8px",
      backgroundColor: "#FAFAFA",
      marginTop: "24px",
    }}>
      <div style={{ flexShrink: 0, color: "#5865F2" }}>
        <svg width="28" height="28" viewBox="0 0 71 55" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M60.105 4.898A58.549 58.549 0 0 0 45.653.415a.22.22 0 0 0-.233.11 40.784 40.784 0 0 0-1.8 3.697c-5.456-.817-10.886-.817-16.235 0-.484-1.164-1.201-2.587-1.827-3.697a.228.228 0 0 0-.233-.11 58.386 58.386 0 0 0-14.451 4.483.207.207 0 0 0-.095.082C1.578 18.73-.944 32.144.293 45.39a.244.244 0 0 0 .093.167c6.073 4.46 11.955 7.167 17.729 8.962a.23.23 0 0 0 .249-.082 42.08 42.08 0 0 0 3.617-5.88.225.225 0 0 0-.123-.312 38.772 38.772 0 0 1-5.539-2.638.228.228 0 0 1-.022-.378 31.772 31.772 0 0 0 1.1-.862.22.22 0 0 1 .23-.031c11.621 5.305 24.199 5.305 35.681 0a.219.219 0 0 1 .232.028c.356.293.728.586 1.103.865a.228.228 0 0 1-.02.378 36.384 36.384 0 0 1-5.54 2.635.226.226 0 0 0-.121.315 47.249 47.249 0 0 0 3.614 5.877.225.225 0 0 0 .249.084c5.801-1.795 11.684-4.502 17.757-8.962a.228.228 0 0 0 .092-.164c1.48-15.315-2.48-28.618-10.497-40.412a.18.18 0 0 0-.093-.084ZM23.725 37.449c-3.498 0-6.38-3.212-6.38-7.156 0-3.944 2.826-7.156 6.38-7.156 3.582 0 6.437 3.24 6.38 7.156 0 3.944-2.826 7.156-6.38 7.156Zm23.549 0c-3.498 0-6.38-3.212-6.38-7.156 0-3.944 2.826-7.156 6.38-7.156 3.582 0 6.437 3.24 6.38 7.156 0 3.944-2.798 7.156-6.38 7.156Z"/>
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "#111111" }}>
          Complaints, now in Discord
        </p>
        <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#777777" }}>
          Use <code style={{ fontSize: "12px", background: "#EBEBEB", padding: "1px 5px", borderRadius: "3px" }}>/report</code> in your hostel channel. Live updates. No forms.
        </p>
      </div>
      <a
        href={serverInviteUrl}
        target="_blank"
        rel="noreferrer"
        style={{
          flexShrink: 0,
          fontSize: "13px",
          fontWeight: 500,
          color: "#1A1A2E",
          border: "1px solid #1A1A2E",
          padding: "6px 14px",
          borderRadius: "4px",
          textDecoration: "none",
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = "#1A1A2E";
          (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
          (e.currentTarget as HTMLAnchorElement).style.color = "#1A1A2E";
        }}
      >
        Join Server →
      </a>
    </div>
  );
}
