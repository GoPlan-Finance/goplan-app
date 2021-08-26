import TestTest from '@views/Test.vue';
import { mount } from '@vue/test-utils';

describe('Views', () => {
  describe('Test', () => {
    describe('Test', () => {
      const mountOptions = {
        propsData: {},
        scopedSlots: {},
      };

      it('should be an actual test', async () => {
        const wrapper = mount(TestTest, mountOptions);

        await wrapper.vm.$nextTick();
        expect(wrapper.html()).toContain('');
      });
    });
  });
});
