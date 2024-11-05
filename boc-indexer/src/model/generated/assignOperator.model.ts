import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, IntColumn as IntColumn_, Index as Index_} from "@subsquid/typeorm-store"

@Entity_()
export class AssignOperator {
    constructor(props?: Partial<AssignOperator>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    from!: string

    @StringColumn_({nullable: false})
    operator!: string

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
