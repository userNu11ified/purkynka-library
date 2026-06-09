import type { Nullable } from '$shared/types/util';
import { Context } from 'runed';

export class StudentState {
	public static context = new Context<StudentState>('student-state');

	public isStudentHelpVisible = $state(true);
	public isUDCListVisible = $state(false);
	public udcSearchedBy: Nullable<string> = $state(null);
}
