import puter from "@heyputer/puter.js";

type HostingConfig = { subdomain: string };
type HostedAsset = {url : string} 

export const getOrCreateHostingConfig = async() : Promise<HostingConfig | null> => {
    const existing = (await puter.kv.get())
}