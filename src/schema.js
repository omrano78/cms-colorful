import { makeSchema, queryType } from "@nexus/schema";
const Query = queryType({
  definition(t) {
    t.string("name", () => "/Omran");
    t.string("surname", () => "Omran");
  },
});
const types = { Query };
export const schema = makeSchema({
  types,
});
