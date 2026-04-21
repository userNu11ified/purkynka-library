import type { RequestHandler } from './$types';
import { handleDelete } from './delete';
import { handleGet } from './get';
import { handlePatch } from './patch';
import { handlePost } from './post';

export const GET: RequestHandler = handleGet;
export const POST: RequestHandler = handlePost;
export const PATCH: RequestHandler = handlePatch;
export const DELETE: RequestHandler = handleDelete;
