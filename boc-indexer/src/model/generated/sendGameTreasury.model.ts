import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {SendTX} from "./_sendTx"

@Entity_()
export class SendGameTreasury {
    constructor(props?: Partial<SendGameTreasury>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    from!: string

    @IntColumn_({nullable: false})
    method!: number

    @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new SendTX(undefined, marshal.nonNull(val)))}, nullable: false})
    sendTXs!: (SendTX)[]

    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @IntColumn_({nullable: false})
    blockNumber!: number

    @StringColumn_({nullable: false})
    blockHash!: string

    @Index_()
    @StringColumn_({nullable: false})
    txHash!: string

    @IntColumn_({nullable: false})
    logIndex!: number
}
