/**
 *
 *
 *
 */
import {BaseCSVImporter, CsvDataInterface} from "@components/Transactions/CustomImporters/BaseCSVImporter";
import dayjs from "dayjs";
import {StringUtils} from "@goplan-finance/utils";
import {TransactionType} from "@models/Transaction";


// Get the list of propreties ONLY defined in Child, excluding  Base and other parents
type OnlyChildProps<Child, Base> = Omit<Child, keyof Base>;
// A string[] matching all the object propreties/getters
type ObjProps<T> = Extract<keyof T, string>;

interface TransformerHandler<T extends keyof CsvDataInterface> {
    columns: string[],

    handler(val: string): CsvDataInterface[T]
}

type Transformers = { [K in ObjProps<CsvDataInterface>]: null | TransformerHandler<K> };


export class Canada_NationalBank_CDBN extends BaseCSVImporter {

    private transformers: Transformers = {
        currency: {
            columns: ['Marche', 'Marché'],
            handler(val: string): string {
                switch (val) {
                    case 'USA':
                        return 'USD'
                    case 'CAN':
                        return 'CAD'
                }
            }
        },
        date: {
            columns: ['Date de transaction',],
            handler(val: string): dayjs.Dayjs {
                return dayjs(val, 'DD/MM/YYYY', true)
            }
        },
        price: {
            columns: ['Prix',],
            handler(val: string): number {
                return StringUtils.toFloatOrNull(val)
            }
        },
        quantity: {
            columns: ['Quantite', 'Quantité'],
            handler(val: string): number {
                return StringUtils.toFloatOrNull(val)
            }
        },
        fees: {
            columns: ['Commission',],
            handler(val: string): number {
                return StringUtils.toFloatOrNull(val)
            }
        },
        totalExcludingFees: {
            columns: ['Montant net',],
            handler(val: string): number {
                return StringUtils.toFloatOrNull(val)
            }
        },
        type: {
            columns: ['Operation',],

            handler(val: string): TransactionType {

                const types: Record<string, TransactionType> = {
                    'Achat': TransactionType.BUY,
                    'Vente': TransactionType.SELL,
                    'Interet': TransactionType.FEES,
                    'Depot': TransactionType.DEPOSIT,

                    'Distribution': TransactionType.DISTRIBUTION,
                    'Div Reinv': TransactionType.DRIP,
                    'Dividende': TransactionType.DIVIDENDS,
                    'Fraction': TransactionType.DEPOSIT, // Balance of a DRIP

                    'Transfert': TransactionType.TRANSFER,

                    'DISECH': null,
                    'INTNAL': null,
                    'Imp Non Res': null,
                    'ROCCAD': null,
                }

                return types[val] ?? null
            }
        },
        accountName: {
            columns: ['Description du compte',],
            handler(val: string): string {
                return val
            }
        },
        symbol: {
            columns: ['Symbole',],
            handler(val: string): string {
                return val
            }
        },
    }

    private computeValue<T extends keyof CsvDataInterface>(name: keyof CsvDataInterface, rawData: unknown): CsvDataInterface[T] {
        //const transformer = Object.entries(this.transformers).find(([name , transformer]) => transformer.columns.includes(colName))
        const transformer = this.transformers[name]

        if (!transformer) {
            throw `Unknown transformer ${name}`
        }
        const rawValue = transformer.columns.find(colName => Object.keys(rawData).includes(colName))

        return transformer.handler(rawValue) as CsvDataInterface[T]
    }

    private getTransformer(colName: string) {
        const transformer = Object.entries(this.transformers).find(([name, transformer]) => transformer.columns.includes(colName))

        if (transformer === undefined) {
            return null
        }

        return {
            dataName: transformer[0],
            info: transformer[1],
        }
    }

    async prepareRow(rawData: unknown): Promise<CsvDataInterface> {
        const row :Partial<CsvDataInterface>= {}
        for (const [colName, colValue] of Object.entries(rawData)) {
            const transformer = this.getTransformer(colName)

            if (!transformer) {
                continue
            }

            row[transformer.dataName] = transformer.info.handler(colValue)
        }

        if(row.type === TransactionType.FEES){
            row.fees = Math.abs(row.totalExcludingFees)
            row.totalExcludingFees = null
        }

        // ISHRS CDN FIN MTH INC ETF                	Fraction	    0		0	7.45
        // ISHRS CDN FIN MTH INC ETF/VALEUR = 15.80	Div Reinv	        2		0
        // ISHRS CDN FIN MTH INC ETF	                Distribution	578		0	23.12
        // ISHRS CDN FIN MTH INC ETF	                Div Reinv	    0		0	-23.12

        return row as CsvDataInterface;
    }


}
