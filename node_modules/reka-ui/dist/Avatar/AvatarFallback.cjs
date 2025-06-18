'use strict';

const vue = require('vue');
const shared = require('@vueuse/shared');
const Avatar_AvatarRoot = require('./AvatarRoot.cjs');
const shared_useForwardExpose = require('../shared/useForwardExpose.cjs');
const Primitive_Primitive = require('../Primitive/Primitive.cjs');

const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  __name: "AvatarFallback",
  props: {
    delayMs: {},
    asChild: { type: Boolean },
    as: { default: "span" }
  },
  setup(__props) {
    const props = __props;
    const rootContext = Avatar_AvatarRoot.injectAvatarRootContext();
    shared_useForwardExpose.useForwardExpose();
    const canRender = vue.ref(props.delayMs === void 0);
    vue.watchEffect((onCleanup) => {
      if (props.delayMs && shared.isClient) {
        const timerId = window.setTimeout(() => {
          canRender.value = true;
        }, props.delayMs);
        onCleanup(() => {
          window.clearTimeout(timerId);
        });
      }
    });
    return (_ctx, _cache) => {
      return canRender.value && vue.unref(rootContext).imageLoadingStatus.value !== "loaded" ? (vue.openBlock(), vue.createBlock(vue.unref(Primitive_Primitive.Primitive), {
        key: 0,
        "as-child": _ctx.asChild,
        as: _ctx.as
      }, {
        default: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["as-child", "as"])) : vue.createCommentVNode("", true);
    };
  }
});

exports._sfc_main = _sfc_main;
//# sourceMappingURL=AvatarFallback.cjs.map
