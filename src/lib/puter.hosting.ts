import puter from "@heyputer/puter.js";
import { createHostingSlug, HOSTING_CONFIG_KEY } from "./util";

type HostingConfig = { subdomain: string };
type HostedAsset = {url : string} 

export const getOrCreateHostingConfig = async(): Promise<HostingConfig | null> => {
    const existing = (await puter.kv.get(HOSTING_CONFIG_KEY)) as HostingConfig | null

    if(existing?.subdomain) 
    return { subdomain: existing.subdomain }

    const subdomain = createHostingSlug()

    try {

        const created = await puter.hosting.create(subdomain, '.')

        const record = { subdomain: created.subdomain }

        return record;

    } catch (e) {
        console.warn(`Could not find subdomain: ${e}`);
        return null
    }
}

export const UploadImageToHosting = async({hosting, url, projectId, label} :
 StoreHostedImageParams) : Promise<HostedAsset | null> => {

 }