import "./Modal.scss";
import { useState } from "react";
import Modal from "react-modal";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* React-modal */
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "15px",
    borderColor: "orange",
  },
};

/* Formik and yup(validation) */
const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label} </label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const Signup = (props) => {
  const { modalIsOpen, closeModal, toggleModal, setToken } = props;
  const [file, setFile] = useState();
  const [image, setImage] = useState(null);

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="login"
      id="login"
      style={customStyles}
    >
      <div className="titleModal">
        <button onClick={closeModal}>
          <FontAwesomeIcon icon="window-close" />
        </button>
      </div>
      <h2>S'inscrire</h2>

      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
        }}
        validationSchema={Yup.object({
          username: Yup.string().required("Obligatoire"),
          email: Yup.string().email("Adresse invalide").required("Obligatoire"),
          password: Yup.string().required("Obligatoire"),
        })}
        onSubmit={async (values, { setSubmitting, submitting }) => {
          const data = new FormData();

          data.append("picture", file);
          const key = Object.keys(values);
          key.forEach((elem) => {
            return data.append(elem, values[elem]);
          });

          const response = await axios.post(
            "http://localhost:5000/signup",
            data
          );
          Cookies.set("tokenMarvel", response.data.token);
          Cookies.set(
            "infoUser",
            `${response.data._id},${response.data.account.username},${
              response.data.account.avatar &&
              response.data.account.avatar.secure_url
            }`
          );
          setSubmitting(false);
          setTimeout(() => {
            if (!submitting) {
              setToken(true);
              closeModal();
            }
          }, 400);
        }}
      >
        <Form>
          <MyTextInput
            label="Nom de compte"
            name="username"
            type="text"
            placeholder="ex: Lutin"
          />
          <MyTextInput
            label="Email"
            name="email"
            type="text"
            placeholder="ex: lutin@test.com"
          />
          <MyTextInput
            label="Mot de passe"
            name="password"
            type="password"
            placeholder="ex: Lf2r8hj9S"
          />
          <label htmlFor="avatar" className="imgAvatar">
            Choisir une photo
          </label>
          <input
            type="file"
            name="avatar"
            id="avatar"
            onChange={(event) => {
              if (event.target.files[0]) {
                setImage(URL.createObjectURL(event.target.files[0]));
              } else {
                setImage(null);
              }
              setFile(event.target.files[0]);
            }}
          />
          {image ? (
            <div className="imagePreview">
              {" "}
              <img src={image} alt="" />{" "}
            </div>
          ) : null}
          <button type="submit">S'inscrire</button>
        </Form>
      </Formik>
      <p onClick={toggleModal}>Déjà un compte ? connecte-toi !</p>
    </Modal>
  );
};

export default Signup;
