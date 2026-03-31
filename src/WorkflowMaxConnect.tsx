export default function WorkflowMaxConnect() {
  const connectWorkflowMax = () => {
    const clientId = import.meta.env.VITE_WORKFLOWMAX_CLIENT_ID
    const redirectUri = 'https://www.aamir.co.za/workflowmax/callback'
    const state = crypto.randomUUID()

    localStorage.setItem('workflowmax_oauth_state', state)

    const authUrl =
      `https://oauth.workflowmax.com/oauth/authorize` +
      `?response_type=code` +
      `&client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent('openid profile email workflowmax offline_access')}` +
      `&state=${encodeURIComponent(state)}` +
      `&prompt=consent`

    window.location.href = authUrl
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Connect WorkflowMax</h1>
      <button className="bg-blue-300 text-yellow-300 hover:bg-blue-500 rounded-full px-4 py-2" onClick={connectWorkflowMax}>Connect WorkflowMax</button>
    </main>
  )
}