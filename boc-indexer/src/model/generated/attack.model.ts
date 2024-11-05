import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_} from "@subsquid/typeorm-store"

@Entity_()
export class Attack {
    constructor(props?: Partial<Attack>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({array: true, nullable: false})
    tokenIds!: (string)[]

    @StringColumn_({nullable: false})
    targetAddress!: string

    @StringColumn_({nullable: false})
    operator!: string

    @StringColumn_({nullable: false})
    attacker!: string

    @IntColumn_({nullable: false})
    targetChain!: number

    @IntColumn_({nullable: false})
    strategy!: number

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
