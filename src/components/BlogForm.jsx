"use client"

import { useActionState } from "react";

export default function BlogForm({ handler }) {

  const [state, action, isPending] = useActionState(handler, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" placeholder="Title" name="title" defaultValue={state?.title} />
        {state?.errors?.title && <p className="text-red-500">{state.errors.title}</p>}
      </div>
      <div>
        <label htmlFor="content">Content</label>
        <textarea placeholder="Content" name="content" rows={6}></textarea>
        {state?.errors?.content && <p className="text-red-500">{state.errors.content}</p>}
      </div>
      <button disabled={isPending} className="btn-primary">
        {isPending ? "Loading..." : "Submit"}
      </button>
    </form>
  );
}