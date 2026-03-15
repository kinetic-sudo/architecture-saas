import puter from "@heyputer/puter.js"
import { ROOMIFY_RENDER_PROMPT } from "./constants"

/**
 * Fetches an image from a URL and returns it as a data URL string.
 * @param url - The URL of the image to fetch
 * @returns Promise that resolves with the data URL string
 */
export const fetchAsDataUrl = async(url: string): Promise<string> => {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
        }
        return response.blob()
      })
      .then((blob) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            const result = reader.result
            if (typeof result === 'string') {
              resolve(result)
            } else {
              reject(new Error('FileReader did not return a string'))
            }
          }
          reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'))
          reader.readAsDataURL(blob)
        })
      })
}

export const generate3DView = async ({ sourceImage }: Generate3DViewParams ) => {
    const datatUrl = sourceImage.startsWith('data:')
    ? sourceImage 
    : await fetchAsDataUrl(sourceImage)

    const base64Data =  datatUrl.split(',')[1];
    const mimeType = datatUrl.split(';')[0].split(':')[1];

    if(!mimeType || !base64Data) throw new Error('Invalid Source image payload');

    const response = await puter.ai.txt2img( ROOMIFY_RENDER_PROMPT, {
        provider: 'gemini',
        model: 'gemini-2.5-flash-image-preview',
        input_image: base64Data,
        input_image_mime_type: mimeType,
        ratio: { w: 1024, h: 1024}
    })

    const rawImage = (response as HTMLImageElement).src ?? null;

    if(!rawImage) return { renderedImage : null, renderedPath: undefined}

    const renderedImage = rawImage.startsWith('data:') ? rawImage : await fetchAsDataUrl(rawImage);

    return { renderedImage, renderedPath: undefined }
}