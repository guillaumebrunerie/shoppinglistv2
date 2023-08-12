import { cronJobs } from "convex/server";
import { api, internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "clean up old deleted tasks",
  { hourUTC: 2, minuteUTC: 0 },
  internal.cleanup.removeDeletedItemsOlderThan,
  { days: 7 },
);

crons.daily(
  "clean up orphan lists",
  { hourUTC: 2, minuteUTC: 5 },
  api.cleanup.removeOrphanLists,
);

crons.daily(
  "clean up orphan items",
  { hourUTC: 2, minuteUTC: 10 },
  api.cleanup.removeOrphanItems,
);

export default crons;
