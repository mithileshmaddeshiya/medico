/**
 * Deoria's articles, in the order they should appear in a listing.
 *
 * Adding one works exactly as described in ../varanasi/index.js: a new file in
 * this folder, imported and appended below. Two posts in this folder may not
 * share a `category` — the pair (category, city) is the URL.
 */
import { buyMedicinesOnlineDeoria } from "./buy-medicines-online";
import { medicineHomeDeliveryDeoria } from "./medicine-home-delivery";
import { onlineMedicineDeliveryDeoria } from "./online-medicine-delivery";

export const deoriaBlogs = [
  onlineMedicineDeliveryDeoria,
  medicineHomeDeliveryDeoria,
  buyMedicinesOnlineDeoria,
];
