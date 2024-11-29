// Call /api/repositories

export async function getRepositories() {
  const response = await fetch('/api/repositories');
  return response.json();
}
