// import { getRoles, hasRole } from '@cloud/Auth/libs/AssertRole'
import { User } from '@models';

describe('Auth', () => {
  describe('AssertRole', () => {
    describe('hasRole', () => {
      // it('should throw if no whitelisted role match ', async () => {
      //   RolesUtils.getRoles = jest
      //     .fn()
      //     .mockReturnValue(Promise.resolve(['role:roleA', 'role:roleB'] as UserRole[]));
      //
      //   const user = new User();
      //
      //   expect(await RolesUtils.hasRole(user, ['role:not-a-role', 'role:something-else'])).toBe(
      //     false
      //   );
      // });
      //
      // it('should throw if no whitelisted role match ', async () => {
      //   RolesUtils.getRoles = jest
      //     .fn()
      //     .mockReturnValue(Promise.resolve(['role:roleA', 'role:roleB']));
      //
      //   const user = new User();
      //
      //   expect(await RolesUtils.hasRole(user, ['role:roleA', 'role:something-else'])).toBe(true);
      //
      //   expect(await RolesUtils.hasRole(user, ['role:roleA', 'role:roleB'])).toBe(true);
      // });
    });
  });
});
