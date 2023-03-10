export default interface ILogger {
	readonly logger: unknown;

	log: (...arg: unknown[]) => void;
	error: (...arg: unknown[]) => void;
	warn: (...arg: unknown[]) => void;
}
