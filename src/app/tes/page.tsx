'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
      }
    }

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Test Page</h1>
      {error && <p>Error: {error}</p>}
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}