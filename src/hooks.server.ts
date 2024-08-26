import { initialize_database } from '$server/database/database';
import { get_saved_password } from '$server/password/password';

await initialize_database();
await get_saved_password();
