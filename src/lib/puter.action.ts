import { getOrCreateHostingConfig, UploadImageToHosting } from './puter.hosting'
import { isHostedUrl } from './util'

const p = () => window.puter  // ✅ use CDN global, no npm import

export const signIn = async () => p().auth.signIn()

export const signOut = async () => {
  p().auth.signOut()
  return true
}

export const getCurrentUser = async () => p().auth.getUser()

export const createProject = async ({ item }: CreateProjectParams):
  Promise<DesignItem | null | undefined> => {
  const projectId = item.id
  const hosting = await getOrCreateHostingConfig()

  const hostedSource = projectId ? await UploadImageToHosting({
    hosting, url: item.sourceImage, projectId, label: 'source'
  }) : null

  const hostedRender = projectId && item.renderedImage ? await UploadImageToHosting({
    hosting, url: item.renderedImage, projectId, label: 'rendered'
  }) : null

  const resolvedSource = hostedSource?.url || (isHostedUrl(item.sourceImage) ?
    item.sourceImage : '')

  if (!resolvedSource) {
    console.warn('failed to load source image, skipping save.')
    return null
  }

  const resolvedRender = hostedRender?.url
    ? hostedRender.url
    : item.renderedImage && isHostedUrl(item.renderedImage)
      ? item.renderedImage
      : undefined

  const { sourcePath: _s, renderedPath: _r, publicPath: _p, ...rest } = item

  const payload = { ...rest, sourceImage: resolvedSource, renderedImage: resolvedRender }

  try {
    await p().kv.set(`project:${projectId}`, JSON.stringify(payload))
    return payload
  } catch (e) {
    console.error('failed to save project', e)
    return null
  }
}