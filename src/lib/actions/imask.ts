import IMask from 'imask';

export function imask(node: HTMLInputElement, options: any) {
  const mask = IMask(node, options);
  return {
    update(newOptions: any) { mask.updateOptions(newOptions); },
    destroy() { mask.destroy(); }
  };
}
