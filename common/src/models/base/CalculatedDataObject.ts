import { BaseObject, SecureObject } from '@goplan-finance/utils';

export abstract class CalculatedDataObject<OPS> extends SecureObject {
  // private readonly calculatedFields: Record<string, CalculatedDataSourceInterface> = {}
  //
  // public _getCalculatedFields(): Record<string, CalculatedDataSourceInterface> {
  //     return this.calculatedFields
  // }
  //
  // protected constructor(className: string, secureFields: string[], calculatedFields: Record<string, CalculatedDataSourceInterface>) {
  //     super(className, secureFields);
  //
  //     this.calculatedFields = calculatedFields
  // }
  //
  // async prepareData(): Promise<void> {
  //
  //     this.pendingOps = await this._prepareData()
  // }
  //
  // public async _preSave(): Promise<void> {
  //
  //     await super._preSave()
  // }
  //
  // public async _postFetch(): Promise<void> {
  //     await super._postFetch()
  //
  //     const ops = this.pendingOps
  //
  //     if (ops) {
  //         Solver.SolveOperations(this)
  //     }
  // }

  get pendingOps(): OPS {
    return this.get('pendingOps');
  }

  set pendingOps(value: OPS) {
    this.set('pendingOps', value);
  }
}
