import { Field, Form, Formik } from "formik";
import React, { isValidElement } from "react";
import { useState } from "react";
import * as yup from "yup";
import _ from "lodash";
import emailjs, { init } from "emailjs-com";
import { ToastProvider, useToasts } from "react-toast-notifications";
import { useRouter } from "next/router";
import ReCAPTCHA from "react-google-recaptcha";
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';

init("iJ7ZZTB3iWGe0UDxi");
const ContactForm = (props) => {
  const router = useRouter();
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCaptchaValid, setIsCaptchaValid] = useState(true);
  const [viewErrors, setViewErrors] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");

  const validationSchema = yup.object().shape({
    firstName: yup.string().required("This field is required.").max(500, "Maximum 500 charcters"),
    lastName: yup.string().required("This field is required.").max(500, "Maximum 500 charcters"),
    email: yup.string().email("This field must be an email.").required("This field is required.").max(500, "Maximum 500 charcters"),
    company: yup.string().max(500, "Maximum 500 charcters"),
    phone: yup.string().required("This field is required."),
    website: yup
      .string()
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        "Enter correct url!"
      ).max(500, "Maximum 500 charcters")
    ,
    message: yup.string().max(500, "Maximum 500 charcters"),
    agreeToPP: yup.bool().oneOf([true], 'You must accept the Privacy Policy to continue').required("You must accept the Privacy Policy to continue"),
    agreeToMM: yup.boolean(),
    describeProject: yup.string().max(500, "Maximum 500 charcters")
  });

  const { addToast } = useToasts();
  function checkPhoneInputValid(value) {
    var index = value.length > 0 ? value.length - 1 : 0
    if (!value)
      return true;
    var charCode = value.charCodeAt(index);
    if (/^[\d ()+]+$/.test(value)) {
      return true;
    }
    return false;
  }
  const submitForm = (vals) => {
    const templateId = "template_c7khei2";
    emailjs
      .send("service_dx6wd0f", templateId, {
        message: vals.message,
        firstName: vals.firstName,
        lastName: vals.lastName,
        email: vals.email,
        company: vals.company ? "Company" + vals.company : "",
        phone: vals.phone,
        website: vals.website ? "Website" + vals.website : "",
        describeProject: vals.describeProject ? "Active Project:" + vals.describeProject : "",
      })
      .then((res) => {
        addToast("Message Sent Successfully", {
          appearance: "success",
          autoDismiss: true,
          autoDismissTimeout: 2000,
          placement: "bottom-center",
          id:"contactFormSubmittedToast"
        });
        setTimeout(() => {
          router.push("/index");
        }, 2000);
      })
      .catch((err) => console.error("Oh well, you failed. Here some thoughts on the error that occured:", err));
  };

  return (
    <ToastProvider>

      <div className="contact-form">

        <Formik
          validationSchema={validationSchema}
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            company: "",
            phone: "",
            website: "",
            message: ``,
          }}
        >
          {({ errors, touched, values, setFieldValue, validateForm }) => (
            <Form>
              <div className="FormPanel">
                <div class="a-contact-form a-contact-form-main">
                  <div class="form-group form_required">
                    <div class="form-label-cell sr-only">
                      <label class="EditingFormLabel">First Name</label>
                    </div>
                    <div class="form-value-cell form-input-cell">
                      <div class="input-icon">
                        <img src="https://simpleacdn.azureedge.net/simpleacdn/simplea/media/images/icons/form/evaluation_ui_form_name.png" />
                      </div>

                      <div class="editing-form-control-nested-control">
                        <div>
                          <Field autocomplete="off" type="text" name="firstName" class="form-control a-contact-lastname a-required placeholder-Last-Name" placeholder="First Name" />
                        </div>
                      </div>
                    </div>
                    <div class="form-validation-cell">
                      {errors.firstName && viewErrors ? <div className="error-text">{errors.firstName}</div> : null}
                    </div>
                  </div>
                  <div class="form-group form_required">
                    <div class="form-label-cell sr-only">
                      <label class="EditingFormLabel">Last Name</label>
                    </div>
                    <div class="form-value-cell form-input-cell">
                      <div class="input-icon">
                        <img src="https://simpleacdn.azureedge.net/simpleacdn/simplea/media/images/icons/form/evaluation_ui_form_name.png" />
                      </div>

                      <div class="editing-form-control-nested-control">
                        <div>
                          <Field autocomplete="off" type="text" name="lastName" class="form-control a-contact-lastname a-required placeholder-Last-Name" placeholder="Last Name" />
                        </div>
                      </div>
                    </div>
                    <div class="form-validation-cell">
                      {errors.lastName && viewErrors ? <div className="error-text">{errors.lastName}</div> : null}
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="form-label-cell sr-only">
                      <label class="EditingFormLabel">Company</label>
                    </div>
                    <div class="form-value-cell form-input-cell">
                      <div class="input-icon">
                        <img src="https://simpleacdn.azureedge.net/simpleacdn/simplea/media/images/icons/form/evaluation_ui_form_company.png" />
                      </div>

                      <div class="editing-form-control-nested-control">
                        <div>
                          <Field autocomplete="off" type="text" name="company" class="form-control a-contact-lastname a-required placeholder-Last-Name" placeholder="Company" />
                        </div>
                      </div>
                    </div>
                    <div class="form-validation-cell">
                      {errors.company && viewErrors ? <div className="error-text">{errors.company}</div> : null}
                    </div>
                  </div>
                  <div class="form-group form_required">
                    <div class="form-label-cell sr-only">
                      <label class="EditingFormLabel">Phone</label>
                    </div>
                    <div class="form-value-cell form-input-cell">
                      <div class="input-icon">
                        <img src="https://simpleacdn.azureedge.net/simpleacdn/simplea/media/images/icons/form/evaluation_ui_form_phone.png" />
                      </div>

                      <div class="editing-form-control-nested-control">
                        <div>
                          <IntlTelInput
                            containerClassName="intl-tel-input"
                            value={phoneValue}
                            onPhoneNumberChange={(isValid, value) => { if (checkPhoneInputValid(value)) { values.phone = value; setPhoneValue(value); } }}
                            fieldName="phone"
                            inputClassName="form-control a-contact-phone a-required placeholder-Phone"
                            telInputProps={{ style: { border: "none" } }}
                          />
                        </div>
                      </div>
                    </div>
                    <div class="form-validation-cell">
                      {errors.phone && viewErrors ? <div className="error-text">{errors.phone}</div> : null}
                    </div>
                  </div>
                  <div class="form-group ">
                    <div class="form-label-cell sr-only">
                      <label class="EditingFormLabel">Website</label>
                    </div>
                    <div class="form-value-cell form-input-cell">
                      <div class="input-icon">
                        <img src="https://simpleacdn.azureedge.net/simpleacdn/simplea/media/images/icons/form/evaluation_ui_form_website.png" />
                      </div>

                      <div class="editing-form-control-nested-control">
                        <div>
                          <Field autocomplete="off" type="text" name="website" class="form-control a-contact-lastname a-required placeholder-Last-Name" placeholder="Website" />
                        </div>
                      </div>
                    </div>
                    <div class="form-validation-cell">
                      {errors.website && viewErrors ? <div className="error-text">{errors.website}</div> : null}
                    </div>
                  </div>
                  <div class="form-group form_required">
                    <div class="form-label-cell sr-only">
                      <label class="EditingFormLabel">Email</label>
                    </div>
                    <div class="form-value-cell form-input-cell">
                      <div class="input-icon">
                        <img src="https://simpleacdn.azureedge.net/simpleacdn/simplea/media/images/icons/form/evaluation_ui_icon_email.png" />
                      </div>

                      <div class="editing-form-control-nested-control">
                        <div>
                          <Field autocomplete="off" type="text" name="email" class="form-control a-contact-lastname a-required placeholder-Last-Name" placeholder="Email" />
                        </div>
                      </div>
                    </div>
                    <div class="form-validation-cell">
                      {errors.email && viewErrors ? <div className="error-text">{errors.email}</div> : null}
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="form-label-cell sr-only">
                      <label class="EditingFormLabel">Message</label>
                    </div>
                    <div class="form-value-cell form-input-cell">
                      <div class="input-icon">
                        <img src="https://simpleacdn.azureedge.net/simpleacdn/simplea/media/images/icons/form/evaluation_ui_form_message.png" />
                      </div>

                      <div class="editing-form-control-nested-control">
                        <div>
                          <Field autocomplete="off" component="textarea" class="form-control a-contact-lastname a-required placeholder-Last-Name" placeholder="Your message" name="message" style={{ resize: 'none' }} />
                        </div>
                      </div>
                    </div>
                    <div class="form-validation-cell">
                      {errors.message && viewErrors ? <div className="error-text">{errors.message}</div> : null}
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="form-label-cell sr-only">
                      <label class="EditingFormLabel">Describe an active project</label>
                    </div>
                    <div class="form-value-cell form-input-cell">
                      <div class="input-icon">
                        <img src="https://simpleacdn.azureedge.net/simpleacdn/simplea/media/images/icons/form/evaluation_ui_project_information.png" />
                      </div>

                      <div class="editing-form-control-nested-control">
                        <div>
                          <Field autocomplete="off" class="form-control a-contact-lastname a-required placeholder-Last-Name" component="textarea" placeholder="Describe an active project" name="describeProject" style={{ resize: 'none' }} />
                        </div>
                      </div>
                    </div>
                    <div class="form-validation-cell">
                      {errors.describeProject && viewErrors ? <div className="error-text">{errors.describeProject}</div> : null}
                    </div>
                  </div>
                  <div class="">
                    <label class="a-form-required-label">
                      * Required Fields.
                    </label>
                  </div>
                  <div class="clearfix"></div>
                  <div class="form_required">
                    <div class="col-md-1 col-sm-1 col-xs-1 agree-tspp">
                      <div
                        id="p_lt_ctl07_pageplaceholder_p_lt_ctl01_UnifiedForm_viewBiz_ctl00_iAgreeToSAndPP">
                        <span class="a-contact-agree a-required checkbox">
                          <Field autocomplete="off" type="checkbox" name="agreeToPP" />

                          <label for="p_lt_ctl07_pageplaceholder_p_lt_ctl01_UnifiedForm_viewBiz_ctl00_iAgreeToSAndPP_fcAgreeToSAndPP_checkbox">&nbsp;
                          </label>
                        </span>
                      </div>
                    </div>
                    <div class="col-md-10 col-sm-11 col-xs-10">
                      <p class="a-form-privacy">I agree to the <a href="/Privacy-Policy"
                        target="_blank">[A] Privacy Policy.</a></p>
                    </div>

                    <div class="error-tospp">
                      <div class="form-validation-cell">
                        {errors.agreeToPP && viewErrors ? <div className="error-text">{errors.agreeToPP}</div> : null}

                      </div>

                    </div>
                  </div>

                  <div class="checkbox-control">
                    <div class="col-md-1 col-sm-1 col-xs-1 agree-tspp">
                      <div
                        id="p_lt_ctl07_pageplaceholder_p_lt_ctl01_UnifiedForm_viewBiz_ctl00_iAgreeToMarkteting">
                        <span class="a-contact-agree-to-marketing checkbox">
                          <Field type="checkbox" name="agreeToMM" />
                          <label
                            for="p_lt_ctl07_pageplaceholder_p_lt_ctl01_UnifiedForm_viewBiz_ctl00_iAgreeToMarkteting_fcMarketingSubscription_checkbox">&nbsp;</label></span>
                      </div>
                    </div>
                    <div class="col-md-10 col-sm-10 col-xs-10 checkbox-control-label">
                      <p class="">I agree to receive marketing material.</p>
                    </div>
                    <div class="form-validation-cell">

                    </div>
                  </div>
                  <div class="clearfix"></div>
                  {/* <div id="p_lt_ctl07_pageplaceholder_p_lt_ctl01_UnifiedForm_viewBiz_ctl00_fSecurityCode">
                    <span
                      id="p_lt_ctl07_pageplaceholder_p_lt_ctl01_UnifiedForm_viewBiz_ctl00_fSecurityCode_fcSecurityCode_captchaControl_captcha">
                      <div>
                        <ReCAPTCHA
                          sitekey="6LeqolEfAAAAALsjdlma9JxmiJ-5k5vGSeYOli_9"
                          onChange={(value)=>{if(value)setIsCaptchaValid(true)}}
                        />
                      </div>
                    </span>
                  </div>
                  <div class="form-validation-cell">

                  </div> */}
                  <div>
                    <input value="Submit" id="submitMainContactForm"
                      class="btn btn-primary btn-block fake-button" type="button"
                      data-loading-text="Please Wait..."
                      onClick={() => {
                        setViewErrors(true);
                        validateForm(values).then((result) => {
                          if (_.isEmpty(result) && isCaptchaValid) {
                            setIsFormValid(true);
                            submitForm(values);
                          } else {
                            setIsFormValid(false);
                          }
                        });
                      }}
                    />
                    <input type="submit"
                      name="p$lt$ctl07$pageplaceholder$p$lt$ctl01$UnifiedForm$viewBiz$ctl00$fSubmit"
                      value="Submit"
                      id="p_lt_ctl07_pageplaceholder_p_lt_ctl01_UnifiedForm_viewBiz_ctl00_fSubmit"
                      class="hide btn btn-primary btn-block form-unified-submit submit-main-contact-button hidden" />
                  </div>
                </div>

              </div>
            </Form>
          )
          }
        </Formik >
      </div >
    </ToastProvider >

  );
};

export default ContactForm;

