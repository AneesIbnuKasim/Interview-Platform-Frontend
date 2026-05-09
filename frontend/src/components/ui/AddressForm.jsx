import React, { memo } from "react";
import { Formik, Form } from "formik";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormTextarea from "./FormTextArea";
import Button from "./Button";
import { addressValidationSchema } from "../../validation/userSchema";

const AddressForm = memo(({ userId, isAdd, initialData = {}, onSubmit, loading, editData='' }) => {
  const initialValues = editData ? {
    fullName: editData.fullName,
    phone: editData.phone,
    pinCode: editData.pinCode,
    state: editData.state,
    city: editData.city,
    addressLine: editData.addressLine,
    label: editData.label,
    isDefault: editData.isDefault,
    ...initialData,
  }
  :
  {
    fullName: "",
    phone: "",
    pinCode: "",
    state: "",
    city: "",
    addressLine: "",
    label: "Home",
    isDefault: false,
    ...initialData,
  }

  return (
    <div className=" overflow-y-auto max-h-[80vh] ">
        <Formik
      initialValues={initialValues}
      validationSchema={addressValidationSchema}
      enableReinitialize
      onSubmit={(values) => {
        onSubmit?.(values);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
      }) => (
        <Form noValidate className="rounded-xl shadow px-6 max-w-lg">

          {/* <h2 className="text-lg font-semibold mb-4">
            {initialData?._id ? "Edit Address" : "Add Address"}
          </h2> */}

          <FormInput
            label="Full Name"
            name="fullName"
            placeholder="Full name"
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.fullName && errors.fullName}
            required
          />

          <FormInput
            label="Phone"
            name="phone"
            placeholder="10 digit mobile number"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phone && errors.phone}
            required
          />

          <FormInput
            label="Pin Code"
            name="pinCode"
            placeholder="Pin code"
            value={values.pinCode}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.pinCode && errors.pinCode}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="State"
              name="state"
              placeholder="State"
              value={values.state}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.state && errors.state}
              required
            />

            <FormInput
              label="City"
              name="city"
              placeholder="City"
              value={values.city}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.city && errors.city}
              required
            />
          </div>

          <FormTextarea
            label="Address"
            name="addressLine"
            placeholder="House no, street, area"
            value={values.addressLine}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.addressLine && errors.addressLine}
            required
            rows={3}
          />

          <FormSelect
            label="Address Type"
            name="label"
            value={values.label}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.label && errors.label}
            required
            options={[
              { label: "Home", value: "Home" },
              { label: "Work", value: "Work" },
              { label: "Other", value: "Other" },
            ]}
          />

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="isDefault"
              checked={values.isDefault}
              onChange={handleChange}
              id="isDefault"
              className="label:input"
            />
            <label htmlFor="isDefault" className="text-sm ">
              Set as default address
            </label>
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              variant='custom'
              block
              loading={loading}
            >
              {editData ? 'UPDATE ADDRESS' : 'SAVE ADDRESS'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
    </div>
  );
});

AddressForm.displayName = "AddressForm";

export default AddressForm;