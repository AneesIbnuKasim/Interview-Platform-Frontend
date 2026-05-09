import { memo } from "react";
import { ImagePlus } from "lucide-react";

export const ImageInput = memo(({handleMultiple, editData}) => {
  return (
    <>
      <label
        htmlFor="imageUpload"
        className="w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
      >
        <ImagePlus className="h-8 w-8 text-gray-400" />
        <span className="text-xs text-gray-400 mt-1">Upload</span>
      </label>

      <input
        id="imageUpload"
        type="file"
        className="hidden"
        multiple
        accept="image/*"
        onChange={handleMultiple}
      />
    </>
  );
});
