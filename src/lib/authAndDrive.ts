import {initializeApp, getApps} from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  type User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
for (const scope of SCOPES) {
  provider.addScope(scope);
}
provider.setCustomParameters({prompt: 'consent'});

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export interface DriveFileSummary {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  webContentLink?: string;
}

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        onAuthSuccess?.(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        onAuthFailure?.(user);
      }
    } else {
      cachedAccessToken = null;
      onAuthFailure?.(null);
    }
  });
};

export const googleSignIn = async (): Promise<{user: User; accessToken: string}> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Google Drive access permission was not granted.');
    }
    cachedAccessToken = credential.accessToken;
    return {user: result.user, accessToken: cachedAccessToken};
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => cachedAccessToken;

export const getCurrentUser = (): User | null => auth.currentUser;

export const logout = async (): Promise<void> => {
  await auth.signOut();
  cachedAccessToken = null;
};

export async function listSkNurDriveFiles(accessToken: string): Promise<DriveFileSummary[]> {
  const query = encodeURIComponent("trashed = false and name contains 'SK-NUR'");
  const fields = encodeURIComponent(
    'files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink)'
  );
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&orderBy=modifiedTime desc&fields=${fields}`,
    {
      headers: {Authorization: `Bearer ${accessToken}`},
    }
  );
  if (!res.ok) {
    throw new Error(`Drive list failed (${res.status})`);
  }
  const data = (await res.json()) as {files?: DriveFileSummary[]};
  return data.files || [];
}

export async function uploadMultipartToDrive(
  accessToken: string,
  fileName: string,
  mimeType: string,
  blob: Blob,
  makeShareable = false
): Promise<DriveFileSummary> {
  const metadata = {
    name: fileName,
    mimeType,
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
  form.append('file', blob, fileName);

  const fields = encodeURIComponent('id,name,mimeType,size,modifiedTime,webViewLink,webContentLink');
  const uploadRes = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=${fields}`,
    {
      method: 'POST',
      headers: {Authorization: `Bearer ${accessToken}`},
      body: form,
    }
  );

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    throw new Error(`Drive upload failed: ${errText}`);
  }

  let fileData = (await uploadRes.json()) as DriveFileSummary;

  if (makeShareable && fileData.id) {
    const permRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileData.id}/permissions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone',
        }),
      }
    );
    if (permRes.ok) {
      const refetch = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileData.id}?fields=${fields}`,
        {headers: {Authorization: `Bearer ${accessToken}`}}
      );
      if (refetch.ok) {
        fileData = (await refetch.json()) as DriveFileSummary;
      }
    }
  }

  return fileData;
}

export async function downloadDriveJsonFile(
  accessToken: string,
  fileId: string
): Promise<Record<string, unknown>> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {Authorization: `Bearer ${accessToken}`},
  });
  if (!res.ok) {
    throw new Error(`Failed to download backup (${res.status})`);
  }
  return (await res.json()) as Record<string, unknown>;
}

export async function deleteDriveFile(accessToken: string, fileId: string): Promise<void> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {Authorization: `Bearer ${accessToken}`},
  });
  if (!res.ok) {
    throw new Error(`Failed to delete Drive file (${res.status})`);
  }
}
