type Pixels = string & {};
type Percent = string & {};

export const pixels = (amount: number): Pixels => `${amount}px`;
export const percent = (amount: number): Percent => `${amount}%`;

const canvas_context = document.createElement('canvas').getContext('2d')!;
export const calculate_text_width = (text: string, font_size: Pixels = '16px', font_weight: string = 'normal') => {
	canvas_context.font = `${font_weight} ${font_size} Nunito`;
	return canvas_context.measureText(text).width;
};
