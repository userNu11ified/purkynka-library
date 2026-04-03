import { bold, cyan, dim, green, magenta, type Ansis } from 'ansis';

const STRING_REGEX = /".*"/g;
const BOOLEAN_REGEX = /true|false/g;

export type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'FATAL';
const COLORIZERS: { [Key in LogLevel]: { timestamp: Ansis; coloredLogLevel: string } } = {
	DEBUG: {
		timestamp: dim.blue,
		coloredLogLevel: bold.blue(' DEBUG ')
	},
	INFO: {
		timestamp: dim.green,
		coloredLogLevel: bold.green('  INFO ')
	},
	WARNING: {
		timestamp: dim.yellow,
		coloredLogLevel: bold.yellow('WARNING')
	},
	ERROR: {
		timestamp: dim.red,
		coloredLogLevel: bold.red(' ERROR ')
	},
	FATAL: {
		timestamp: dim.red,
		coloredLogLevel: bold.bgRed(' FATAL ')
	}
};

export class Logger {
	private namespaces: string[];
	private namespacesString: string;

	constructor(namespaces: string[]) {
		this.namespaces = namespaces;
		this.namespacesString = cyan`[${this.namespaces.join(' / ')}]`;
	}

	private getTimestamp() {
		const date = new Date();
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');

		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const seconds = date.getSeconds().toString().padStart(2, '0');
		const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
	}

	private log(
		logLevel: LogLevel,
		message: string,
		additionalData?: object,
		logTo: (...data: unknown[]) => void = console.log
	) {
		const colorizer = COLORIZERS[logLevel];

		const timestamp = colorizer.timestamp(this.getTimestamp());
		const coloredLogLevel = colorizer.coloredLogLevel;

		logTo(`${timestamp} ${coloredLogLevel} ${this.namespacesString}: ${message}`);
		if (additionalData !== undefined) {
			let stringifiedObject = JSON.stringify(additionalData, undefined, 4);
			stringifiedObject = stringifiedObject.replaceAll(STRING_REGEX, green('$&'));
			stringifiedObject = stringifiedObject.replaceAll(BOOLEAN_REGEX, magenta('$&'));

			const lines = stringifiedObject.split('\n');
			lines.forEach((line, i) =>
				console.log(
					`${colorizer.timestamp(i === 0 ? '╭─' : i == lines.length - 1 ? '╰─' : '├─')} ${line}`
				)
			);
		}
	}

	public subnamespace(subnamespaces: string[]) {
		return new Logger([...this.namespaces, ...subnamespaces]);
	}

	public debug(message: string, additionalData?: object) {
		this.log('DEBUG', message, additionalData, console.debug);
	}

	public info(message: string, additionalData?: object) {
		this.log('INFO', message, additionalData, console.info);
	}

	public warning(message: string, additionalData?: object) {
		this.log('WARNING', message, additionalData, console.warn);
	}

	public error(message: string, additionalData?: object) {
		this.log('ERROR', message, additionalData, console.error);
	}

	public fatal(message: string, additionalData?: object) {
		this.log('FATAL', message, additionalData, console.error);
	}
}
