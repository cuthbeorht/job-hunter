import { useState } from 'react';
import { getMe } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Me() {
  const { token, logout } = useAuth();
  const [data, setData] = useState<any>(null);

  async function fetchMe() {
    const res = await getMe();
    console.debug('Me response:', res);
    setData(res);
  }

  if (!token) {
    return <div className="card">Not logged in</div>;
  }

  return (
    <div className="card">
      <h2>Profile</h2>
      <button onClick={fetchMe}>Fetch /me</button>
      <button onClick={logout}>Logout</button>

      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}