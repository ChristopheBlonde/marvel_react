import "./Modal.scss";
import Modal from "react-modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
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
Modal.setAppElement("body");

const Login = (props) => {
  const { modalIsOpen, closeModal, toggleModal, locationModal, setToken } =
    props;
  const history = useHistory();

  /* Formik and yup(validation)*/

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Adresse invalide").required("Obligatoire"),
      password: Yup.string().required("Obligatoire"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/login",
          values
        );
        Cookies.set(
          "infoUser",
          `${response.data._id},${response.data.account.username},${
            response.data.account.avatar &&
            response.data.account.avatar.secure_url
          }`
        );
        Cookies.set("tokenMarvel", response.data.token);
        if (Cookies.get("tokenMarvel")) {
          setToken(true);
          closeModal();
          if (locationModal) {
            history.push({
              pathname: `/favorites/${response.data._id}`,
              state: { user_id: response.data._id },
            });
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    },
  });

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
      <h2>Se connecter</h2>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="email">Adresse mail</label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email ? (
          <div>{formik.errors.email}</div>
        ) : null}
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          name="password"
          id="password"
          className="passwordInput"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password ? (
          <div>{formik.errors.password} </div>
        ) : null}
        <button type="submit">Se connecter</button>
      </form>

      <p onClick={toggleModal}>Pas encore de compte ? inscris-toi !</p>
    </Modal>
  );
};

export default Login;
