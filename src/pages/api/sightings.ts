import type { APIRoute } from "astro";
import { addSighting } from "../../lib/db";
import { bus } from "../../lib/events";

// The write half: a plain HTML form POSTs here, the sighting goes into
// SQLite, and the new row is broadcast to every open SSE connection. The 303
// redirect makes the form work with no client-side JavaScript at all — the
// submitting tab re-renders from the database; every *other* tab hears about
// it over the stream.
export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const stop = String(form.get("stop") ?? "").trim();
  const note = String(form.get("note") ?? "").trim();
  if (stop && note) {
    bus.emit("sighting", addSighting(stop, note.slice(0, 280)));
  }
  return redirect("/", 303);
};
