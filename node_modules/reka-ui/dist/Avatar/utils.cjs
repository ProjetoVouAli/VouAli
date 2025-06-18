'use strict';

const shared = require('@vueuse/shared');
const vue = require('vue');

function resolveLoadingStatus(image, src) {
  if (!image) {
    return "idle";
  }
  if (!src) {
    return "error";
  }
  if (image.src !== src) {
    image.src = src;
  }
  return image.complete && image.naturalWidth > 0 ? "loaded" : "loading";
}
function useImageLoadingStatus(src, { referrerPolicy, crossOrigin } = {}) {
  const isMounted = vue.ref(false);
  const imageRef = vue.ref(null);
  const image = vue.computed(() => {
    if (!isMounted.value) {
      return null;
    }
    if (!imageRef.value && shared.isClient) {
      imageRef.value = new window.Image();
    }
    return imageRef.value;
  });
  const loadingStatus = vue.ref(resolveLoadingStatus(image.value, src.value));
  const updateStatus = (status) => () => {
    if (isMounted.value)
      loadingStatus.value = status;
  };
  vue.onMounted(() => {
    isMounted.value = true;
    vue.watchEffect((onCleanup) => {
      const img = image.value;
      if (!img)
        return;
      loadingStatus.value = resolveLoadingStatus(img, src.value);
      const handleLoad = updateStatus("loaded");
      const handleError = updateStatus("error");
      img.addEventListener("load", handleLoad);
      img.addEventListener("error", handleError);
      if (referrerPolicy?.value)
        img.referrerPolicy = referrerPolicy.value;
      if (typeof crossOrigin?.value === "string")
        img.crossOrigin = crossOrigin.value;
      onCleanup(() => {
        img.removeEventListener("load", handleLoad);
        img.removeEventListener("error", handleError);
      });
    });
  });
  vue.onUnmounted(() => {
    isMounted.value = false;
  });
  return loadingStatus;
}

exports.useImageLoadingStatus = useImageLoadingStatus;
//# sourceMappingURL=utils.cjs.map
