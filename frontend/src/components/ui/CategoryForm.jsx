import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormInput from "./FormInput";
import FormTextarea from "./FormTextArea";
import Button from "./Button";
import { IoIosAddCircle } from "react-icons/io";
import { ImageInput } from "./ImageInput.jsx";
import { useState } from "react";

const CategoryForm = ({ initialData= null, handleSubmit }) => {

  const [preview, setPreview] = useState('')
  const [image, setImage] = useState('')

  const initialValues = {
    name: initialData?.name || "",
    description: initialData?.description || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Category name is required"),
    description: Yup.string().required('Description is required'),
  });

  const handleImageInput = (e) => {
    const file = e.target.files[0]
    setImage(file)

    const preview = URL.createObjectURL(file)
    setPreview(preview)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={(values) => {
        initialData ? handleSubmit(values) : handleSubmit({
          image,
          ...values
        })
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form>
          <div className="flex flex-col">

            {/* NAME */}
            <FormInput
              label="Category Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name}
              placeholder="Enter category name"
            />

            {/* DESCRIPTION */}
            <FormTextarea
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.description && errors.description}
              placeholder="Enter description"
            />

            {/* IMAGE PREVIEW */}
            {!initialData && (
              <>
              <div className="">
            <img src={preview} className="w-24 h-24 object-cover rounded-4xl" />
            </div>
            {/* IMAGE */}
            <ImageInput handleMultiple={handleImageInput} />
              </>
            )}

            <Button
              icon={<IoIosAddCircle />}
              className="mt-4"
              type="submit"
            >
              {initialData ? "EDIT CATEGORY" : "ADD CATEGORY"}
            </Button>

          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CategoryForm;