// Fits the popover's height to a view: a head and foot as tall as they are, and a scrolling body (.ed-b) as tall as
// the one element inside it, up to `max`; past that the body scrolls.
export function fit(page: HTMLElement, { max, set }: { max: () => number; set: (height: number) => void }) {
  const measure = () => {
    let h = 0;
    for (const el of page.children as HTMLCollectionOf<HTMLElement>) {
      if (!el.classList.contains("ed-b")) h += el.offsetHeight;
      else {
        const s = getComputedStyle(el);
        h += (el.firstElementChild?.getBoundingClientRect().height ?? 0) + parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
      }
    }
    set(Math.min(Math.ceil(h), max()));
  };
  const ro = new ResizeObserver(measure);
  for (const el of page.children) ro.observe(el.classList.contains("ed-b") && el.firstElementChild ? el.firstElementChild : el);
  return { destroy: () => ro.disconnect() };
}
