import { defineComponent, ref, watchEffect, createBlock, createCommentVNode, unref, openBlock, withCtx, renderSlot } from 'vue';
import { isClient } from '@vueuse/shared';
import { i as injectAvatarRootContext } from './AvatarRoot.js';
import { u as useForwardExpose } from '../shared/useForwardExpose.js';
import { P as Primitive } from '../Primitive/Primitive.js';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AvatarFallback",
  props: {
    delayMs: {},
    asChild: { type: Boolean },
    as: { default: "span" }
  },
  setup(__props) {
    const props = __props;
    const rootContext = injectAvatarRootContext();
    useForwardExpose();
    const canRender = ref(props.delayMs === void 0);
    watchEffect((onCleanup) => {
      if (props.delayMs && isClient) {
        const timerId = window.setTimeout(() => {
          canRender.value = true;
        }, props.delayMs);
        onCleanup(() => {
          window.clearTimeout(timerId);
        });
      }
    });
    return (_ctx, _cache) => {
      return canRender.value && unref(rootContext).imageLoadingStatus.value !== "loaded" ? (openBlock(), createBlock(unref(Primitive), {
        key: 0,
        "as-child": _ctx.asChild,
        as: _ctx.as
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["as-child", "as"])) : createCommentVNode("", true);
    };
  }
});

export { _sfc_main as _ };
//# sourceMappingURL=AvatarFallback.js.map
