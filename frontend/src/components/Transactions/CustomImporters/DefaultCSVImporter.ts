/**
 *
 *
 *
 */
import {BaseCSVImporter, CsvDataInterface} from "@components/Transactions/CustomImporters/BaseCSVImporter";


export class DefaultCSVImporter extends BaseCSVImporter {

    async prepareRow(row: unknown): Promise<CsvDataInterface> {
        return row as CsvDataInterface
    }
}
