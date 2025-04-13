export async function getBackendToken(email: string, password: string) {
  // Implement the logic to exchange the NextAuth.js session token with the backend API token
  // Use the /api/token endpoint to generate JWTs
  // Example:
  const apiUrl = process.env.API_URL || 'http://localhost:7000';
  const response = await fetch(`${apiUrl}/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'tenant': 'your_tenant_id' // Replace with your tenant ID
    },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  return data.token;

  // Replace this with your actual implementation
  // return "backend-token";
}