export const sum = (numbers: number[]) => {
	if (numbers.length === 0) return 0;
	return numbers.reduce((prev, curr) => prev + curr);
};
