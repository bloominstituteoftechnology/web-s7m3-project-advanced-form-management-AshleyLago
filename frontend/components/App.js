// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, {useEffect, useState} from 'react'
import axios from 'axios';
import * as yup from 'yup';

const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.
const formSchema = yup.object().shape({
  username: yup.string().trim()
    .min(3, e.usernameMin)
    .max(20, e.usernameMax)
    .required(e.usernameRequired ),
  favLanguage: yup.string()
    .oneOf(['javascript', 'rust'], e.favLanguageOptions)
    .required( e.favLanguageRequired ).trim(),
  favFood: yup.string()
    .oneOf(['pizza', 'spaghetti', 'broccoli'], e.favFoodOptions)
    .required( e.favFoodRequired ).trim(),
  agreement: yup.boolean()
    .oneOf([true], e.agreementOptions)
    .required( e.agreementRequired ),
})

const initialValues = () => ({ username: "", favLanguage: "", favFood: "", agreement: false});
const initialErrors = () => ({ username: "", favLanguage: "", favFood: "", agreement: ""});

export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.

  const [values, setValues] = useState(initialValues());
  const [errors, setErrors] = useState(initialErrors());
  const [enabledSub, setEnabledSub] = useState(false);
  const [succSer, setSuccSer] = useState();
  const [failSer, setFailSer] = useState();

  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.
  useEffect(() => {
    formSchema.isValid(values).then(setEnabledSub)
  }, [values]);

  const onChange = evt => {
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
    let { type, checked, name, value} = evt.target;
    value = type == 'checkbox' ? checked : value;
    setValues({...values, [name]: value})
    yup
      .reach(formSchema, name)
      .validate(value)
      .then(() => { setErrors ({...errors, [name]: ''}) })
      .catch((error) => { setErrors ({...errors, [name]: error.errors[0]}) })
  }

  const onSubmit = evt => {
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
    evt.preventDefault()
    axios.post('https://webapis.bloomtechdev.com/registration', values)
      .then(res => {
        setValues(initialValues())
        setSuccSer(res.data.message)
        setFailSer()
      })
      .catch(err => {
        setFailSer(err.response.data.message)
        setSuccSer()
      })
  }

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        { succSer && <h4 className="success">{succSer}</h4>}
        { failSer && <h4 className="error">{failSer}</h4>}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input id="username" name="username" type="text" placeholder="Type Username" onChange={onChange} value={values.username}/>
          { errors.username && <div className="validation">{errors.username}</div> }
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input type="radio" name="favLanguage" value="javascript" onChange={onChange} checked={values.favLanguage == 'javascript'}/>
              JavaScript
            </label>
            <label>
              <input type="radio" name="favLanguage" value="rust" onChange={onChange} checked={values.favLanguage == 'rust'}/>
              Rust
            </label>
          </fieldset>
          { errors.favLanguage && <div className="validation">{errors.favLanguage}</div> }
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select id="favFood" name="favFood" onChange={onChange} value={values.favFood}>
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          { errors.favFood && <div className="validation">{errors.favFood}</div> }
        </div>

        <div className="inputGroup">
          <label>
            <input id="agreement" type="checkbox" name="agreement" onChange={onChange} checked={values.agreement}/>
            Agree to our terms
          </label>
          { errors.agreement && <div className="validation">{errors.agreement}</div> }
        </div>

        <div>
          <input type="submit" disabled={!enabledSub} />
        </div>
      </form>
    </div>
  )
}
