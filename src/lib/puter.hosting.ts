import {
    createHostingSlug, getHostedUrl, getImageExtension,
    HOSTING_CONFIG_KEY, imageUrlToPngBlob
  } from './util'
  
  const p = () => window.puter
  
  export const getOrCreateHostingConfig = async (): Promise<HostingConfig | null> => {
    try {
      const existing = (await p().kv.get(HOSTING_CONFIG_KEY)) as HostingConfig | null
      if (existing?.subdomain) return { subdomain: existing.subdomain }
  
      const subdomain = createHostingSlug()
      const created = await p().hosting.create(subdomain, '.')
      const record = { subdomain: created.subdomain }
      await p().kv.set(HOSTING_CONFIG_KEY, record)
      return record
    } catch (e) {
      console.warn('Could not create hosting config:', e)
      return null
    }
  }
  
  // ✅ Converts any data URL or base64 string directly to Blob — no fetch()
  const dataUrlToBlob = (dataUrl: string): { blob: Blob; contentType: string } | null => {
    try {
      const [meta, data] = dataUrl.split(',')
      if (!meta || !data) return null
      const contentType = meta.split(':')[1]?.split(';')[0] ?? 'image/jpeg'
      const binary = atob(data)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
      return { blob: new Blob([bytes], { type: contentType }), contentType }
    } catch {
      return null
    }
  }
  
  export const UploadImageToHosting = async ({ hosting, url, projectId, label }:
    StoreHostedImageParams): Promise<HostedAsset | null> => {
    if (!hosting || !url) return null
  
    // ✅ Already a hosted URL — nothing to upload
    if (url.startsWith('http://') || url.startsWith('https://')) return { url }
  
    try {
      let resolved: { blob: Blob; contentType: string } | null = null
  
      if (label === 'rendered') {
        const blob = await imageUrlToPngBlob(url)
        resolved = blob ? { blob, contentType: 'image/png' } : null
      } else {
        // source images come as data URLs from FileReader
        resolved = dataUrlToBlob(url)
      }
  
      if (!resolved) { console.warn('could not resolve blob for', label); return null }
  
      const { blob, contentType } = resolved
      const ext = getImageExtension(contentType, url)
      const dir = `projects/${projectId}`
      const filePath = `${dir}/${label}.${ext}`
      const uploadFile = new File([blob], `${label}.${ext}`, { type: contentType })
  
      await p().fs.mkdir(dir, { createMissingParents: true })
      await p().fs.write(filePath, uploadFile)
  
      const hostedUrl = getHostedUrl({ subdomain: hosting.subdomain }, filePath)
      return hostedUrl ? { url: hostedUrl } : null
    } catch (e) {
      console.warn('Could not upload to hosting:', e)
      return null
    }
  }