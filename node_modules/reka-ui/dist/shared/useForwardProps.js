import { getCurrentInstance, toRef, computed, toRefs, camelize } from 'vue';

function useForwardProps(props) {
  const vm = getCurrentInstance();
  const defaultProps = Object.keys(vm?.type.props ?? {}).reduce((prev, curr) => {
    const defaultValue = (vm?.type.props[curr]).default;
    if (defaultValue !== void 0)
      prev[curr] = defaultValue;
    return prev;
  }, {});
  const refProps = toRef(props);
  return computed(() => {
    const propsAsRefs = toRefs(refProps.value);
    const preservedProps = {};
    const assignedProps = vm?.vnode.props ?? {};
    Object.keys(assignedProps).forEach((key) => {
      preservedProps[camelize(key)] = assignedProps[key];
    });
    return Object.keys({ ...defaultProps, ...preservedProps }).reduce((prev, curr) => {
      const val = propsAsRefs[curr]?.value;
      if (val !== void 0)
        prev[curr] = val;
      return prev;
    }, {});
  });
}

export { useForwardProps as u };
//# sourceMappingURL=useForwardProps.js.map
