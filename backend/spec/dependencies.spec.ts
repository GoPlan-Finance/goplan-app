// jest.mock('@cloud/Auth/libs/AssertRole')
// const mockedDependency = <jest.Mock<typeof dep.getRoles>>dep.getRoles

// here the whole foo var is mocked deeply
// const MgetRoles = mocked(getRoles, true)
//
// jest.mock('@cloud/Auth/libs/AssertRole', () => ({
//   ...(jest.requireActual('@cloud/Auth/libs/AssertRole') as any),
//   getRoles : jest.fn(() => {
//     return Promise.resolve(['roleA', 'roleB'])
//   }),
// }))

import { MoneyUtils } from '@goplan-finance/utils';
import { Money } from 'ts-money';

describe('dependencies', () => {
  it('should use the same dependency instances', async () => {
    expect(MoneyUtils.fromAmount(1234) instanceof Money).toBe(true);
  });
});
