export const get_return_date = (borrow_date: Date, times_extended: number) => {
	const return_date = new Date(borrow_date);
	return_date.setMonth(return_date.getMonth() + 1 + times_extended);

	return return_date;
};
