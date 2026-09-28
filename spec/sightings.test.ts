import { beforeAll, describe, expect, inject, it } from "vitest";

// Drives the running app over HTTP to prove the two platform claims this
// spec actually checks hold in THIS repo: a sighting survives a reload, and
// a new one reaches other clients over the SSE stream. Adapted from the
// starter's guestbook check (spec/README.md) onto this app's own
// stop/note shape and event name.
const baseUrl = inject("baseUrl");

describe("sightings", () => {
  let note: string;

  beforeAll(() => {
    note = `spec probe ${process.hrtime.bigint()}`;
  });

  // Astro checks form POSTs carry a same-origin Origin header (CSRF
  // protection); browsers send it automatically, a bare fetch doesn't.
  const post = (path: string, body: URLSearchParams) =>
    fetch(new URL(path, baseUrl), {
      method: "POST",
      headers: { origin: baseUrl },
      body,
      redirect: "manual",
    });

  it("accepts a sighting and redirects back to the page", async () => {
    const res = await post("/api/sightings", new URLSearchParams({ stop: "ANU Rimmer Street", note }));
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("/");
  });

  it("persists the sighting: a fresh page load includes it", async () => {
    const res = await fetch(baseUrl);
    expect(await res.text()).toContain(note);
  });

  it("broadcasts new sightings over the SSE stream", async () => {
    const live = `live probe ${process.hrtime.bigint()}`;

    // subscribe first, then post, then read until the event arrives
    const stream = await fetch(new URL("/api/events", baseUrl));
    expect(stream.headers.get("content-type")).toContain("text/event-stream");
    const reader = stream.body?.getReader();
    if (!reader) throw new Error("no response body");

    await post("/api/sightings", new URLSearchParams({ stop: "ANU Rimmer Street", note: live }));

    const decoder = new TextDecoder();
    let received = "";
    while (!received.includes(live)) {
      const { value, done } = await reader.read();
      if (done) throw new Error("stream ended before the event arrived");
      received += decoder.decode(value, { stream: true });
    }
    await reader.cancel();
    expect(received).toContain("event: sighting");
    expect(received).toContain(live);
  }, 10_000);
});
