import { MoneyUtils } from '@utils/MoneyUtils';
import { Money } from 'ts-money';

describe('dependencies', () => {
  it('should use the same dependency instances', async () => {
    const $money = MoneyUtils.fromAmount(1234);
    expect($money instanceof Money).toBe(true);
  });
});
