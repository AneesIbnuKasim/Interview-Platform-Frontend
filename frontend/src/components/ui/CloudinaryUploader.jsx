import React, { useRef } from "react";
import { adminAPI } from "../../services/adminService";

const CloudinaryUploader = memo(({ value, onChange }) => {
  const fileInputRef = useRef();

  // Upload to backend -> cloudinary
  const uploadImages = async (files) => {
    const formData = new FormData();
    for (let file of files) {
      formData.append("images", file);
    }

    const data = await adminAPI.uploadImages(formData)

    // Send uploaded URL & public_id to Formik
    onChange([...(value || []), ...data.files]);
  };

  const handleFileChange = (e) => {
    uploadImages(e.target.files);
  };

  const removeImage = (index) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div>
      {/* Upload Box */}
      <div
        className="w-full h-32 border border-dashed border-gray-400 flex items-center justify-center rounded cursor-pointer"
        onClick={() => fileInputRef.current.click()}
      >
        <p className="text-gray-500">Click to upload images</p>
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Image Preview Grid */}
      <div className="grid grid-cols-3 gap-3 mt-3">
        {value?.map((img, index) => (
          <div key={index} className="relative group">
            <img
              src={img.url}
              alt="preview"
              className="w-full h-28 object-cover rounded"
            />

            {/* Delete button */}
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-1 text-xs opacity-80 group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
)

export default CloudinaryUploader;


//usage 

    //   <CloudinaryUploader
    //     value={formik.values.images}
    //     onChange={(imgs) => formik.setFieldValue("images", imgs)}
    //   />