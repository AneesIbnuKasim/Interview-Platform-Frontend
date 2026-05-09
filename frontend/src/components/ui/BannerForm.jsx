import React, { useEffect, useState } from "react";
import { useFormik, FieldArray } from "formik";

import Button from "./Button";
import { useProduct } from "../../context/ProductContext";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import { bannerSchema } from "../../validation/userSchema";
import { useSelector } from "react-redux";
import ProductSearchInput from "./ProductSearchInput";
import formatImageUrl from "../../utils/formatImageUrl";

export default function BannerForm({ onConfirm, onCancel, editData = "" }) {
  const { loading } = useSelector((state) => state.banner);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { products, fetchProduct } = useProduct()

  // ---- IMAGE HANDLING ----
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  //CLEAN PREVIEW
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  //EDIT IMAGE HANDLE
  useEffect(() => {
    if (editData?.image) {
      setPreview(editData.image); // backend URL
      setImage(null); // only send new file if changed
    }
  }, [editData]);

  //PREVIEW EDIT DATA IMAGE
  useEffect(() => {
    if (editData?.image) {
      const imageUrl = formatImageUrl(editData.image)
      setPreview(imageUrl);
    }
  }, [editData]);

  useEffect(() => {
    if (!products.length > 0) {
      fetchProduct()
    }
  },[])
  
  const handleProductSelect = (product) => {
    formik.setFieldValue('linkValue', product._id)
  }

  // ---- FORM STATE ----
  const formik = useFormik({
    initialValues: editData
      ? {
          title: editData.title,
          subTitle: editData.subTitle,
          linkType: editData.linkType,
          linkValue: editData.linkValue,
          position: editData.position,
          status: editData.status,
          order: editData.order,
        }
      : {
          title: "",
          subTitle: "",
          linkType: "",
          linkValue: "",
          position: "",
          status: "",
          order: "",
        },
    validationSchema: bannerSchema,

    onSubmit: (values) => {
      const finalData = {
        ...values,
        image,
      };
      onConfirm(finalData);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      noValidate
      className="w-full h-[80vh] overflow-y-auto bg-white p-6 rounded-xl shadow-sm grid grid-cols-1 gap-6"
    >
      <div className="flex flex-col gap-4">
        {/* TITLE */}
        <FormInput
          label="Banner Title"
          name="title"
          required
          placeholder="Enter banner title..."
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && formik.errors.title}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* SUBTITLE */}
          <FormInput
            label="Sub Title"
            name="subTitle"
            required
            placeholder="Enter banner sub-title..."
            value={formik.values.subTitle}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.subTitle && formik.errors.subTitle}
          />
          {/* POSITION */}
          <FormSelect
            label="Position"
            name="position"
            value={formik.values.position}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            placeholder="Choose position"
            options={(["HOME_TOP", "HOME_MIDDLE"] || []).map((p) => ({
              value: p,
              label: p.replace("_", " "),
            }))}
            error={formik.touched.position && formik.errors.position}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* URL TYPE */}
          <FormSelect
            label="URL Type"
            name="linkType"
            value={formik.values.linkType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            placeholder="Choose type"
            options={(["category", "product", "filter", "search"] || []).map(
              (p) => ({
                value: p,
                label: p.replace("_", " "),
              })
            )}
            error={formik.touched.linkType && formik.errors.linkType}
          />

          {/* LINK VALUE */}
          {formik.values.linkType === "product" ? (
            <div className='mt-5'>
              <ProductSearchInput label={'Link Value'} onSelect={handleProductSelect}  products={products} />
            </div>
          ) : (
            <FormInput
              label="Link Value"
              name="linkValue"
              required
              type="string"
              placeholder="Enter URL link..."
              value={formik.values.linkValue}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.linkValue && formik.errors.linkValue}
            />
          )}
        </div>
        {/* STATUS + ORDER */}
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Status"
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            placeholder="Choose position"
            options={(["active", "inactive"] || []).map((p) => ({
              value: p,
              label: p,
            }))}
            error={formik.touched.status && formik.errors.status}
          />
          <FormInput
            label="Order"
            name="order"
            type="number"
            min="0"
            step="1"
            placeholder="Enter order"
            value={formik.values.order}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.order && formik.errors.order}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <label className="cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />

            {preview ? (
              <img
                src={formatImageUrl(preview)}
                alt="preview"
                className="w-full h-48 object-scale-down rounded-xl border border-dashed hover:opacity-90 transition"
              />
            ) : (
              <div className="w-full h-48 border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400">
                Click to upload banner image
              </div>
            )}
          </label>
        </div>

        <div className="flex  justify-end gap-4 mt-4">
          {/* <Button
            variant="danger"
            onClick={onCancel}
            size="sm"
            className={'flex-1'}
          >
            CANCEL
          </Button> */}

          <Button
            type="submit"
            variant="custom"
            size="sm"
            loading={loading}
            className={"flex-1"}
          >
            {editData ? "UPDATE BANNER" : "ADD BANNER"}
          </Button>
        </div>
      </div>
    </form>
  );
}
