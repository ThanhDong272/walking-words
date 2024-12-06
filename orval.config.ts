import { defineConfig } from "orval";

export default defineConfig({
  api: {
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
    input: {
      target: "./openapi.yaml",
    },
    output: {
      mode: "tags-split",
      target: "./services/network/generated",
      schemas: "./services/network/generated/model",
      client: "react-query",
      override: {
        query: {
          useQuery: true,
          useInfinite: true,
          useInfiniteQueryParam: "page",
        },
        mutator: {
          path: "./services/network/index.ts",
          name: "axiosInstance",
        },
      },
    },
  },
});
