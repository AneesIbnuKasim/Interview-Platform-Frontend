import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FormInput } from "../components/ui";


function ProfileForm() {
  return (
    <main className="flex-1 p-10">
            <h2 className="text-xl font-semibold mb-6">Account Info</h2>

            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
              }}
              validationSchema={ProfileSchema}
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              {() => (
                <Form className="space-y-6 max-w-2xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <Field
                        name="firstName"
                        placeholder="Enter your name..."
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="p"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <Field
                        name="lastName"
                        placeholder="Enter your last name..."
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="p"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <FormInput
                      name="email"
                      type="email"
                      label= 'Email Address'
                      required
                      placeholder="Enter your email..."
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
                    />
                    
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone Number <span className="text-gray-400">(Optional)</span>
                    </label>
                    <Field
                      name="phone"
                      placeholder="Enter mobile number..."
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700"
                  >
                    save
                  </button>
                </Form>
              )}
            </Formik>
          </main>
  )
}

export default ProfileForm
