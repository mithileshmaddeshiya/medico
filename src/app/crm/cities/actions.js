"use server";

/**
 * Service city and area actions (the areas screen uses these too). These
 * are operational lists — where home collection runs — and do not touch the
 * website's city pages, which /admin/cities manages.
 */
import { refresh } from "next/cache";
import { redirect } from "next/navigation";

import { crmAction, run } from "@/lib/crm/guard";
import { createArea, createCity, setAreaFlag, setCityFlag, updateArea, updateCity } from "@/lib/crm/stores/catalog";

const s = (fd, k) => String(fd.get(k) ?? "").trim();

export async function createCityAction(prev, fd) {
  let id;
  const result = await run("cities/create", async () => {
    const user = await crmAction("catalog.manage");
    id = await createCity({ name: s(fd, "name"), state: s(fd, "state"), collection: fd.get("collection") === "on" }, { user });
    return { ok: true };
  });
  if (result.ok && id) redirect(`/crm/cities/${id}?created=1`);
  return result;
}

export async function updateCityAction(prev, fd) {
  return run("cities/update", async () => {
    const user = await crmAction("catalog.manage");
    const changed = await updateCity(s(fd, "id"), { name: s(fd, "name"), state: s(fd, "state") }, { user });
    refresh();
    return { ok: true, message: changed ? "City saved." : "Nothing changed." };
  });
}

export async function cityFlagAction(prev, fd) {
  return run("cities/flag", async () => {
    const user = await crmAction("catalog.manage");
    await setCityFlag(s(fd, "id"), s(fd, "flag"), s(fd, "value"), { user });
    refresh();
    return { ok: true, message: "Updated." };
  });
}

export async function createAreaAction(prev, fd) {
  return run("areas/create", async () => {
    const user = await crmAction("catalog.manage");
    await createArea({ cityId: s(fd, "cityId"), name: s(fd, "name"), pincode: s(fd, "pincode") }, { user });
    refresh();
    return { ok: true, message: "Area added." };
  });
}

export async function updateAreaAction(prev, fd) {
  return run("areas/update", async () => {
    const user = await crmAction("catalog.manage");
    const changed = await updateArea(s(fd, "id"), { name: s(fd, "name"), pincode: s(fd, "pincode") }, { user });
    refresh();
    return { ok: true, message: changed ? "Area saved." : "Nothing changed." };
  });
}

export async function areaFlagAction(prev, fd) {
  return run("areas/flag", async () => {
    const user = await crmAction("catalog.manage");
    await setAreaFlag(s(fd, "id"), s(fd, "flag"), s(fd, "value"), { user });
    refresh();
    return { ok: true, message: s(fd, "value") === "deleted" ? "Area removed." : "Updated." };
  });
}
