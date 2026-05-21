export function initChatbot({ onAction, getContext }) {
  const body = document.getElementById("chatBody");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatText");
  const toggle = document.getElementById("chatToggle");

  let collapsed = false;

  function addMsg(text, who) {
    const div = document.createElement("div");
    div.className = `msg ${who}`;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  toggle.addEventListener("click", () => {
    collapsed = !collapsed;
    body.style.display = collapsed ? "none" : "block";
    form.style.display = collapsed ? "none" : "flex";
    toggle.textContent = collapsed ? "+" : "–";
  });

  addMsg("Hi! Ask me about parasite risk, or try: 'zoom to Leeds', 'reset view', 'help'.", "bot");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = input.value.trim();
    if (!message) return;

    input.value = "";
    addMsg(message, "user");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          context: getContext ? getContext() : {}
        })
      });

      const data = await res.json();
      addMsg(data.reply || "No reply.", "bot");

      if (data.action && data.action.type && data.action.type !== "none") {
        onAction?.(data.action);
      }
    } catch (err) {
      addMsg("Could not reach the assistant. Please try again.", "bot");
    }
  });
}
