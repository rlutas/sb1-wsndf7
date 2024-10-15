import { google } from 'googleapis'
import { GoogleAuth } from 'google-auth-library'

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

async function getAuthClient() {
  const auth = new GoogleAuth({
    scopes: SCOPES
  })
  return auth.getClient()
}

export async function downloadExclusionList(fileId: string) {
  const authClient = await getAuthClient()
  const drive = google.drive({ version: 'v3', auth: authClient })

  try {
    const response = await drive.files.get({
      fileId: fileId,
      alt: 'media',
    })
    return response.data
  } catch (error) {
    console.error('Eroare la descărcarea fișierului de excludere:', error)
    throw error
  }
}