// ReviewForm.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Star } from "lucide-react";
import { useState } from "react";

export function ReviewForm({ onSubmitReview }) {
  const [hover, setHover] = useState(0);

  return (
    <Formik
      initialValues={{ name: "", email: "", review: "", rating: 0 }}
      validationSchema={Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        review: Yup.string().required("Review cannot be empty"),
        rating: Yup.number()
          .min(1, "Rating required")
          .required("Rating required"),
      })}
      onSubmit={(values, { resetForm }) => {
        if (onSubmitReview) onSubmitReview(values);
        // resetForm();
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="form-border rounded-lg p-6 shadow-sm bg-white flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Field
                name="name"
                placeholder="Your Name"
                className="w-full input-border rounded-full px-4 py-3 bg-white focus:outline-none"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="flex flex-col">
              <Field
                name="email"
                placeholder="Your Email"
                className="w-full input-border rounded-full px-4 py-3 bg-white focus:outline-none"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <Field
              as="textarea"
              name="review"
              placeholder="Write your review..."
              className="input-border rounded-xl w-full px-4 py-3 bg-white focus:outline-none"
              rows="4"
            />
            <ErrorMessage
              name="review"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <p className="text-sm mb-2 font-medium">Your Rating:</p>

            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((val) => (
                <Star
                  key={val}
                  size={22}
                  onClick={() => setFieldValue("rating", val)}
                  onMouseEnter={() => setHover(val)}
                  onMouseLeave={() => setHover(0)}
                  className={`cursor-pointer transition ${
                    val <= (hover || values.rating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <ErrorMessage
              name="rating"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-black text-white text-sm w-fit ml-auto hover:bg-gray-900"
          >
            Post Review
          </button>
        </Form>
      )}
    </Formik>
  );
}
