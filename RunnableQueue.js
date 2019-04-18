class RunnableQueue {
	constructor() {
		this.runnables = [];
		this.timeouts = [];

		this.clear = this.clear.bind(this);
	}

	nextRun(callback, millis = 0) {
		this.runnables.push({ callback, millis });
	}

	start() {
		this.runnables.concat({ callback: this.clear, millis: 0 }).reduce((millis, runnable) => {
			const time = millis + runnable.millis;
			this.timeouts.push(setTimeout(() => runnable.callback(), time));
			return time;
		}, 0);
	}

	clear() {
		this.timeouts.forEach(timeout => clearTimeout(timeout));
		this.timeouts = [];
		this.runnables = [];
	}
}

module.exports = RunnableQueue;