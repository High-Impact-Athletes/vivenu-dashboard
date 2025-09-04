export function createReadOnlyKVNamespace(kv: KVNamespace | undefined | null): KVNamespace | null {
	if (!kv) return null;

	const readOnly: KVNamespace = {
		get: kv.get.bind(kv) as any,
		getWithMetadata: (kv as any).getWithMetadata ? (kv as any).getWithMetadata.bind(kv) : (async () => ({ value: null, metadata: null })) as any,
		list: kv.list.bind(kv) as any,
		put: async () => {
			throw new Error('READ_ONLY_KV: Writes are disabled in this environment');
		},
		delete: async () => {
			throw new Error('READ_ONLY_KV: Deletes are disabled in this environment');
		}
	} as KVNamespace;

	return readOnly;
}


