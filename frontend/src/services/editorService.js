import { editorApi } from "@/lib/api";

export const editorService = {
  runCode(roomId, payload) {
    return editorApi.run(roomId, payload);
  },
  runPlaygroundCode(payload) {
    return editorApi.runPlayground(payload);
  },
  listPlaygroundFiles() {
    return editorApi.listPlaygroundFiles();
  },
  createPlaygroundFile(payload) {
    return editorApi.createPlaygroundFile(payload);
  },
  updatePlaygroundFile(fileId, payload) {
    return editorApi.updatePlaygroundFile(fileId, payload);
  },
  openPlaygroundFile(fileId) {
    return editorApi.openPlaygroundFile(fileId);
  },
};
