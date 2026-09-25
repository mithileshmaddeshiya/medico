/**
 * Side-effect module: each CRM module registers its exports (see
 * registerExport in ./exports.js), and the export route imports this one
 * file to get them all. One line per module.
 */
import "./exporters/customers";
import "./exporters/partners";
import "./exporters/finance";
import "./exporters/system";
