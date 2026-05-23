import { editorApi } from "@/lib/api";

export const editorService = {
  runCode(roomId, payload) {
    return editorApi.run(roomId, payload);
  },
  runPlaygroundCode(payload) {
    return editorApi.runPlayground(payload);
  },
};
