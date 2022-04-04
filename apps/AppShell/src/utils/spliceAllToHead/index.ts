export const spliceAllToHead = (elements: HTMLCollectionOf<HTMLElement>): void => {
  while (elements.length) {
    const el = elements.item(0)
    if (el) {
      document.head.appendChild(el)
    }
  }
}
