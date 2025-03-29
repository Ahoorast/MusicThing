// hooks.server.ts
import { createContext } from '$lib/tprc/context';
import { router } from '$lib/tprc/router';
import type { Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle: Handle = createTRPCHandle({ router, createContext });
