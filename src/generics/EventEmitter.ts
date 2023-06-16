interface EventEmitterInterface {
    on: (signal: string, callback: (...params: any) => void) => void;
    emit: (signal: string, data: any) => void;
}

export default class EventEmitter implements EventEmitterInterface {
    private callbacks_: Record<string, Array<(...params: any) => void>>;

    constructor() {
        this.callbacks_ = {};
    }

    on(signal: string, callback: (...params: any) => void): void {
        if (!this.callbacks_[signal]) {
            this.callbacks_[signal] = [];
        }
        this.callbacks_[signal].push(callback);
    }

    emit(signal: string, data: any): void {
        setTimeout(() => {
            if (this.callbacks_[signal]) {
                for (const callback of this.callbacks_[signal]) {
                    callback(data);
                }
            }
        }, 0);
    }
}
