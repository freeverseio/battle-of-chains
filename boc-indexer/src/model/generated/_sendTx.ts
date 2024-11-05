import assert from "assert"
import * as marshal from "./marshal"

export class SendTX {
    private _recipient!: string
    private _amount!: string

    constructor(props?: Partial<Omit<SendTX, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._recipient = marshal.string.fromJSON(json.recipient)
            this._amount = marshal.string.fromJSON(json.amount)
        }
    }

    get recipient(): string {
        assert(this._recipient != null, 'uninitialized access')
        return this._recipient
    }

    set recipient(value: string) {
        this._recipient = value
    }

    get amount(): string {
        assert(this._amount != null, 'uninitialized access')
        return this._amount
    }

    set amount(value: string) {
        this._amount = value
    }

    toJSON(): object {
        return {
            recipient: this.recipient,
            amount: this.amount,
        }
    }
}
