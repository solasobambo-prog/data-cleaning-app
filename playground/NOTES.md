# [NOTES.md](http://NOTES.md) — Accessible Component Comparison

Hand-built sources: `playground/Modal.tsx`, `playground/Tabs.tsx`, `playground/Disclosure.tsx`.  

Generated sources: `components/ui/dialog.tsx`, `components/ui/tabs.tsx` (Nova preset, `radix-ui` primitives).

## What shadcn/ui handled that my version missed

1. Background inertness. My modal traps Tab inside the dialog and restores focus on close, but I never marked the rest of the page inert. A screen-reader virtual cursor can still leave the dialog and land on the nav or page content behind it. shadcn's Dialog uses Radix Dialog, which takes the background out of the accessibility tree while open. That `inert` / `aria-hidden` behavior is not a line in `dialog.tsx`; it comes from the `radix-ui` Dialog primitive.
2. Scroll locking. My modal does not stop the page behind it from scrolling. Radix Dialog locks body scroll while open. Also not written in the generated file.
3. Portal rendering. My modal is a `fixed` `div` rendered in place under `/playground`. If a parent ever sets `overflow` or a lower `z-index`, the dialog can clip. shadcn wraps overlay + panel in `DialogPortal` inside `DialogContent`, so the dialog mounts on `document.body`.
4. Outside click. My modal closes on the Close button and Escape only. shadcn renders `DialogOverlay` next to `DialogPrimitive.Content`. Overlay click dismissal is that pattern plus Radix, not something I implemented.



## Confirmed by reading the generated source



### Dialog `components/ui/dialog.tsx`)

- Portal: `DialogContent` returns `<DialogPortal>` around the overlay and panel.
- Overlay: the same function renders `<DialogOverlay />` immediately before `<DialogPrimitive.Content>`.
- Title: `DialogTitle` forwards props to `DialogPrimitive.Title` with `data-slot="dialog-title"`. I labelled my dialog with a hand-wired `aria-labelledby` on a plain `<h2>`.
- Close name: `DialogPrimitive.Close` wraps a `Button` that includes `<span className="sr-only">Close</span>` next to `XIcon`. The icon alone would have no accessible name.
- Inert and scroll lock: no `inert` attribute and no `document.body.style.overflow` in this file. Those belong to the primitive imported from `"radix-ui"`.



### Tabs `components/ui/tabs.tsx`)

- Import: `{ Tabs as TabsPrimitive } from "radix-ui"` (not `@radix-ui/react-tabs`).
- Exports: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `tabsListVariants`.
- Composition: shadcn splits tablist / tab / panel into separate components. Mine is one `Tabs` that owns state. My first version also unmounted inactive panels, so `aria-controls` pointed at an id that did not exist until that tab was selected.



## What I already matched

- Modal: `role="dialog"`, `aria-modal="true"`, Escape closes, Tab cycles inside, focus returns to Open modal.
- Tabs: `tablist` / `tab` / `tabpanel`, `aria-selected`, roving `tabIndex`, ArrowLeft / ArrowRight / Home / End.
- Disclosure: button with `aria-expanded` and `aria-controls="disclosure-panel-demo"`; Enter and Space toggle; DevTools shows Expanded flipping with the attribute.

