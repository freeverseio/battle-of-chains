import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_} from "@subsquid/typeorm-store"

@Entity_()
export class Upgrade {
    constructor(props?: Partial<Upgrade>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    operator!: string

    @StringColumn_({nullable: false})
    user!: string

    @IntColumn_({nullable: false})
    chain!: number

    @StringColumn_({nullable: false})
    tokenId!: string

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
