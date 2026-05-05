const DISCORD_APP_ID = process.env.DISCORD_APP_ID;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

const commands = [
  {
    name: "report",
    description: "Report a hostel complaint",
    options: [
      {
        name: "category",
        description: "Complaint category",
        type: 3, // STRING
        required: true,
        choices: [
          { name: "Plumbing", value: "plumbing" },
          { name: "Electricity", value: "electricity" },
          { name: "WiFi", value: "wifi" },
          { name: "Cleanliness", value: "cleanliness" },
          { name: "Carpentry", value: "carpentry" },
          { name: "Pest", value: "pest" },
          { name: "Structural", value: "structural" },
          { name: "Other", value: "other" },
        ],
      },
      { name: "description", description: "Describe the issue", type: 3, required: true },
      { name: "room_code", description: "Room code (e.g. SmB-801)", type: 3, required: false },
    ],
  },
  {
    name: "status",
    description: "Check complaint ticket status",
    options: [
      { name: "ticket_id", description: "Ticket ID", type: 3, required: true },
    ],
  },
  {
    name: "my-tickets",
    description: "View your recent complaint tickets",
  },
];

async function register() {
  const url = `https://discord.com/api/v10/applications/${DISCORD_APP_ID}/commands`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
  });

  if (res.ok) {
    console.log("Slash commands registered successfully");
    const data = await res.json();
    console.log(`Registered ${data.length} commands`);
  } else {
    console.error("Failed:", res.status, await res.text());
  }
}

register();
