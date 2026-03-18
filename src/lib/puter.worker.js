const PROJECT_PREFIX = 'roomify_project_';

const jsonError = ( status, message, extra = {} ) => {
    return new Response(JSON.stringify({ error: message, ...extra }), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    })
}

const getUserId = async (userPuter) => {
    try {
        const user = await userPuter.auth.getUser()

        return user?.uuid || null
    } catch {
        return null
    }
}

router.post('/api/projects/save', async({ request, user }) => {
    try {
        const userPuter = user.puter;

        if(!userPuter) return jsonError(401, 'Authentication failed');

        const body = await request.json();
        const project = body?.project;

        if(!project?.id || !project?.sourceImage) {
            return jsonError(400, 'Invalid project: missing id or sourceImage', {
                missing: {
                    id: !project?.id,
                    sourceImage: !project?.sourceImage,
                },
                receivedKeys: project && typeof project === 'object' ? Object.keys(project) : null,
            })
        }

        const payload = {
            ...project,
            updatedAt: new Date().toISOString()
        }

        const userId = await getUserId(userPuter);
        if(!userId) return jsonError(401, 'Authentication failed')

        const key = `${PROJECT_PREFIX}${project.id}`;
        await userPuter.kv.set(key, payload)

        return {saved: true, id: project.id, project: payload}

    } catch (e) {
        return jsonError(500, 'failed to save project', {message: e.message || 'Unknown error'});
    }
})

router.get('/api/projects/list', async ({ user }) => {
    try {
        const userPuter = user.puter;
        if(!userPuter) return jsonError(401, 'Authentication failed');

        const userId = await getUserId(userPuter);
        if(!userId) return jsonError(401, 'Authentication failed')

        const kv = userPuter.kv;
        if(!kv) return jsonError(500, 'KV store unavailable');

        // Puter KV APIs differ by environment; support common variants.
        let entries = [];
        if(typeof kv.list === 'function') {
            entries = await kv.list({ prefix: PROJECT_PREFIX });
        } else if(typeof kv.keys === 'function') {
            entries = await kv.keys(PROJECT_PREFIX);
        } else if(typeof kv.listKeys === 'function') {
            entries = await kv.listKeys({ prefix: PROJECT_PREFIX });
        } else {
            return jsonError(500, 'KV list operation unavailable');
        }

        const keys = (entries || [])
            .map((e) => typeof e === 'string' ? e : (e?.key ?? e?.name ?? e?.id))
            .filter((k) => typeof k === 'string' && k.startsWith(PROJECT_PREFIX));

            const projects = await Promise.all(
                        keys.map(async (key) => {
                            const value = await userPuter.kv.get(key);
                            return { ...value, isPublic: true };
                           })
                    );
         return { projects };
    } catch (e) {
        return jsonError(500, 'failed to list projects', { message: e.message || 'Unknown error' });
    }
})

router.get('/api/projects/get', async ({ request, user }) => {
    try {
        const userPuter = user.puter;
        if(!userPuter) return jsonError(401, 'Authentication failed');

        const userId = await getUserId(userPuter);
        if(!userId) return jsonError(401, 'Authentication failed')

        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if(!id) return jsonError(400, 'Missing id');

        const key = `${PROJECT_PREFIX}${id}`;
        const project = await userPuter.kv.get(key);
        if(!project) return jsonError(404, 'Project not found', { id });

        return { project };
    } catch (e) {
        return jsonError(500, 'failed to get project', { message: e.message || 'Unknown error' });
    }
})

router.delete('/api/projects/delete', async ({ request, user }) => {
    try {
      const userPuter = user.puter
      if (!userPuter) return jsonError(401, 'Authentication failed')

        const userId = await getUserId(userPuter)
        if (!userId) return jsonError(401, 'Authentication failed')

  
      const url = new URL(request.url)
      const id = url.searchParams.get('id')
      if (!id) return jsonError(400, 'Missing id')
  
      const key = `${PROJECT_PREFIX}${id}`
      await userPuter.kv.del(key)
  
      return new Response(JSON.stringify({ deleted: true, id }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      })
    } catch (e) {
      return jsonError(500, 'failed to delete project', { message: e.message })
    }
  })