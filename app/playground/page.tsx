"use client";

import { useId, useState } from "react";
import { Modal } from "@/playground/Modal";
import { Tabs } from "@/playground/Tabs";
import { Disclosure } from "@/playground/Disclosure";

export default function PlaygroundPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const titleId = useId();

  return (
    <div className="mx-auto max-w-3xl space-y-10 p-8">
      <h1 className="text-2xl font-bold">Accessible Component Playground</h1>

      <section>
        <h2 className="mb-2 font-semibold">Modal</h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded bg-slate-900 px-4 py-2 text-white"
        >
          Open modal
        </button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          titleId={titleId}
          title="Example modal"
        >
          <p>This is a focus-trapped modal dialog.</p>
        </Modal>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Tabs</h2>
        <Tabs
          tabs={[
            { id: "one", label: "One", panel: <p>Content for tab one.</p> },
            { id: "two", label: "Two", panel: <p>Content for tab two.</p> },
            { id: "three", label: "Three", panel: <p>Content for tab three.</p> },
          ]}
        />
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Disclosure</h2>
        <Disclosure summary="What is this?" id="demo">
          <p>This is a disclosure widget revealing hidden content.</p>
        </Disclosure>
      </section>
    </div>
  );
}