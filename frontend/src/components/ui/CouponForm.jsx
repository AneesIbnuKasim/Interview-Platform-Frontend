import { Formik, Form } from "formik";
import FormInput from "./FormInput";
import Button from "./Button";
import { IoIosAddCircle } from "react-icons/io";
import FormSelect from "../ui/FormSelect";
import { couponValidation } from "../../validation/userSchema";
import FormDateInput from "./FormDateInput";
import FormMultiCheckbox from "./FormMultiCheckBox";
import { useCategory } from "../../context/CategoryContext";
import { useEffect } from "react";

const CouponForm = ({ editData, onConfirm }) => {
  const { categories, fetchCategories } = useCategory();
  const discountTypes = [
    { label: "FLAT", value: "FLAT" },
    { label: "PERCENT", value: "PERCENT" },
  ];

  //category options
  const categoryOptions = categories.map(c=> (
    {label: c.name, value: c._id}
  ))

  useEffect(() => {
    if (!categories.length > 0) {
      fetchCategories();
    }
  }, []);
  
  const initialValues = {
    code: "",
    discountType: '',
    startDate: "",
    endDate: "",
    discountValue: '',
    maxDiscountAmount: '',
    minOrderAmount: '',
    usageLimit: '',
    usedCount: "",
    perUserLimit: "",
    applicableCategories: [],
  };
  const editInitialValues = editData ? {
    code: editData?.code,
    discountType: editData.discountType,
    startDate: new Date(editData.startDate).toISOString().split("T")[0],
    endDate: new Date(editData.endDate).toISOString().split("T")[0],
    discountValue: editData.discountValue,
    maxDiscountAmount: editData.maxDiscountAmount,
    minOrderAmount: editData.minOrderAmount,
    usageLimit: editData.usageLimit,
    usedCount: editData.usedCount,
    perUserLimit: editData.perUserLimit,
    applicableCategories: editData.applicableCategories,
  } : initialValues

  return (
    <Formik
      initialValues={editInitialValues}
      validationSchema={couponValidation}
      enableReinitialize
      onSubmit={onConfirm}
    >
      {({ values, setFieldValue, errors, touched, handleChange, handleBlur }) => (
        <Form>
          <div className="flex flex-col">
            {/* CODE */}
            <div className="flex justify-between gap-5">
              <FormInput
                label="Code"
                name="code"
                value={values.code}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.code && errors.code}
                placeholder="Enter coupon code"
                className="w-full"
              />
              {/* DISCOUNT TYPE */}
              <FormSelect
                label="Discount Type"
                name="discountType"
                options={discountTypes}
                value={values.discountType}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.discountType && errors.discountType}
                placeholder="Select discount type"
                className="w-full"
              />
            </div>

            <div className="flex justify-between gap-5">
              {/* START DATE  */}
              <FormDateInput
                label="Start Date"
                name="startDate"
                value={values.startDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.startDate && errors.startDate}
                placeholder="Enter used count"
                className="w-full"
              />
              {/* END DATE */}
              <FormDateInput
                label="End Date"
                name="endDate"
                value={values.endDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.endDate && errors.endDate}
                placeholder="Enter user limit"
                className="w-full"
              />
            </div>

            <div className="flex justify-between gap-5">
              {/* DISCOUNT VALUE  */}
              <FormInput
                label="Discount Value"
                name="discountValue"
                value={values.discountValue}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.discountValue && errors.discountValue}
                placeholder="Enter discount value"
                className="w-full"
              />
              {/* USAGE LIMIT */}
              <FormInput
                label="Usage Limit"
                name="usageLimit"
                value={values.usageLimit}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.usageLimit && errors.usageLimit}
                placeholder="Enter usage limit"
                className="w-full"
              />
            </div>
            <div className="flex justify-between gap-5">
              {/* MIN ORDER AMOUNT  */}
              <FormInput
                label="Minimum Order Amount"
                name="minOrderAmount"
                value={values.minOrderAmount}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.minOrderAmount && errors.minOrderAmount}
                placeholder="Enter min order amount"
                className="w-full"
              />
              {/* MAX DISCOUNT AMOUNT */}
              <FormInput
                label="Max Discount Amount"
                name="maxDiscountAmount"
                value={values.maxDiscountAmount}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.maxDiscountAmount && errors.maxDiscountAmount}
                placeholder="Enter max discount amount"
                className="w-full"
              />
            </div>
            <div className="flex justify-between gap-5">
              {/* USED COUNT  */}
              {/* <FormInput
                label="Used count"
                name="usedCount"
                value={values.usedCount}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.usedCount && errors.usedCount}
                placeholder="Enter used count"
                className="w-full"
              /> */}
              {/* PER USER LIMIT */}
              <FormInput
                label="User Limit"
                name="perUserLimit"
                value={values.perUserLimit}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.perUserLimit && errors.perUserLimit}
                placeholder="Enter user limit"
                className="w-[50%]"
              />
            </div>

            <FormMultiCheckbox
              label={"Choose categories"}
              name={"applicableCategories"}
              options={categoryOptions}
              values={values.applicableCategories}
              setFieldValue={setFieldValue}
              error={touched.categories && errors.categories}
            />

            <Button icon={<IoIosAddCircle />} className="mt-4" type="submit">
              {editData ? "EDIT COUPON" : "ADD COUPON"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CouponForm;
