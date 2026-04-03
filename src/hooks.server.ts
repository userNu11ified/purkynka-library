import { DatabaseWorker } from '$server/worker/workers';

await DatabaseWorker.initialized.then(() => console.log('DatabaseWorker Initialized!'));
