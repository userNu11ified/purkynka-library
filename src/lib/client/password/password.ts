import { setup_synced_store } from '$client/local_storage/local_storage';
import type { Nullable } from '$shared/common_types';

export const [PASSWORD, PASSWORD_UNSUBSCRIBER] = setup_synced_store<Nullable<string>>('password', null);
