import { getOrCreateHostingConfig, UploadImageToHosting } from './puter.hosting'

const p = () => window.puter

export const signIn = async () => p().auth.signIn()
export const signOut = async () => { p().auth.signOut(); return true }
export const getCurrentUser = async () => p().auth.getUser()

const toDataUrl = (base64: string, mime = 'image/jpeg') =>
  base64.startsWith('data:') ? base64 : `data:${mime};base64,${base64}`

export const createProject = async ({ item }: CreateProjectParams):
  Promise<DesignItem | null | undefined> => {
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

    await p().kv.set(`project:${projectId}`, JSON.stringify(payload))
    console.log('✅ project saved:', projectId)
    return payload
  } catch (e) {
    console.error('failed to create project', e)
    return null
  }
}