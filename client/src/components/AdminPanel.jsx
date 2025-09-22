import { useState } from "react";
import { admin } from "../lib/apiClient";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);

  return (
    <section>
      <h2>Admin Panel</h2>
      <button onClick={async () => setUsers(await admin.users())}>Load Users</button>
      <ul>{users.map(u => <li key={u.id}>{u.username || JSON.stringify(u)}</li>)}</ul>
    </section>
  );
}
