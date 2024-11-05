import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_} from "@subsquid/typeorm-store"

@Entity_()
export class ChainActionProposal {
    constructor(props?: Partial<ChainActionProposal>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    operator!: string

    @StringColumn_({nullable: false})
    user!: string

    @IntColumn_({nullable: false})
    sourceChain!: number

    @IntColumn_({nullable: false})
    targetChain!: number

    @IntColumn_({nullable: false})
    actionType!: number

    @IntColumn_({nullable: false})
    attackArea!: number

    @StringColumn_({nullable: false})
    attackAddress!: string

    @StringColumn_({nullable: false})
    comment!: string

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
