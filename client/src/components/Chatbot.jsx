import { useState } from "react";
import { chatbot } from "../lib/apiClient";

export default function Chatbot() {
  const [msg, setMsg] = useState("");
  const [res, setRes] = useState(null);

  return (
    <section >
      <h2>Chatbot</h2>
      <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Ask something..." />
      <button onClick={async () => setRes(await chatbot.ask(msg))}>Send</button>
      <pre>{JSON.stringify(res, null, 2)}</pre>
    </section>
  );
}
