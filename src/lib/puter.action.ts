import { PUTER_WORKER_URL } from './constants';
import { getOrCreateHostingConfig, UploadImageToHosting } from './puter.hosting'

const p = () => window.puter

export const signIn = async () => p().auth.signIn()
export const signOut = async () => { p().auth.signOut(); return true }
export const getCurrentUser = async () => p().auth.getUser()

const toDataUrl = (base64: string, mime = 'image/jpeg') => {
  // ✅ Already a hosted URL or data URL — return as-is
  if (base64.startsWith('http://') || base64.startsWith('https://') || base64.startsWith('data:')) {
    return base64
  }
  return `data:${mime};base64,${base64}`
}

export const createProject = async ({ item, visibility = "private" }: CreateProjectParams): Promise<DesignItem | null | undefined> => {
  if(!PUTER_WORKER_URL) {
    console.warn('Misssing VITE_PUTER_WORKER_URL; skip history fetch;') 
    return null
  }
  
  const projectId = item.id

  try {
    const hosting = await getOrCreateHostingConfig()
    if (!hosting) { console.error('failed to get hosting config'); return null }

    const hostedSource = await UploadImageToHosting({
      hosting, url: toDataUrl(item.sourceImage), projectId, label: 'source'
    })

    const hostedRender = item.renderedImage ? await UploadImageToHosting({
      hosting, url: toDataUrl(item.renderedImage), projectId, label: 'rendered'
    }) : null

    if (!hostedSource?.url) { console.warn('failed to upload source image'); return null }

    const { sourcePath: _s, renderedPath: _r, publicPath: _p, ...rest } = item as any
    const payload: DesignItem = {
      ...rest,
      sourceImage: hostedSource.url,
      renderedImage: hostedRender?.url ?? undefined,
    }

    console.log('📦 Sending payload to worker:', {
      id: payload.id,
      sourceImage: payload.sourceImage?.substring(0, 50),
      hasRendered: !!payload.renderedImage,
      allKeys: Object.keys(payload)
    })

    const response = await p().workers.exec(`${PUTER_WORKER_URL}/api/projects/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ project: payload, visibility }),
    });

    

    if (!response.ok) {
      console.error('failed to save the project', await response.text());
      return null
    }

    const data = (await response.json() as {project?: DesignItem | null})
    return data?.project ?? null;

    // await p().kv.set(`project:${projectId}`, JSON.stringify(payload))
    // console.log('✅ project saved:', projectId)
    // return payload
  } catch (e) {
    console.error('failed to save project', e)
    return null
  }
}

export const getProjects = async() => {
  if(!PUTER_WORKER_URL) {
    console.warn('Misssing VITE_PUTER_WORKER_URL; skip history fetch;') 
    return []
  }
  
      try {
        const response = await p().workers.exec(`${PUTER_WORKER_URL}/api/projects/list`, {
          method: 'GET'
        })

        if(!response.ok) {
          console.error('failed to fetch project history', await response.text());
          return []
        }

        const data = (await response.json() as {projects?: DesignItem[] | null})
        return Array.isArray(data?.projects) ? data?.projects : []
      } catch (e) {
        console.log('failed to get project for signing in', e)
        return []
      }
}

export const getProjectById = async ({ id }: { id: string }) => {
  if (!PUTER_WORKER_URL) {
      console.warn("Missing VITE_PUTER_WORKER_URL; skipping project fetch.");
      return null;
  }

  console.log("Fetching project with ID:", id);

  try {
      const response = await p().workers.exec(
          `${PUTER_WORKER_URL}/api/projects/get?id=${encodeURIComponent(id)}`,
          { method: "GET" },
      );

      console.log("Fetch project response:", response);

      if (!response.ok) {
          console.error("Failed to fetch project:", await response.text());
          return null;
      }

      const data = (await response.json()) as {
          project?: DesignItem | null;
      };

      console.log("Fetched project data:", data);

      return data?.project ?? null;
  } catch (error) {
      console.error("Failed to fetch project:", error);
      return null;
  }
};

export const deleteProject = async ({ id }: { id: string }): Promise<boolean> => {
  if (!PUTER_WORKER_URL) return false
  try {
    const response = await p().workers.exec(
      `${PUTER_WORKER_URL}/api/projects/delete?id=${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )
    return response.ok
  } catch (e) {
    console.error('failed to delete project', e)
    return false
  }
}