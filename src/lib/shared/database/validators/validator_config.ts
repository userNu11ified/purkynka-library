import { configure } from 'arktype';

export const setupValidatorConfig = () => configure({ onUndeclaredKey: 'reject' });
