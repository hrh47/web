import * as API from "../api/user";
import { dispatchNotification } from "./notifications";
import { errorToString } from "../utils";

/*
 * @param {function} dispatch
 * @returns {function}
 */
export const updateUser = dispatch =>
  /*
   * @param {Object} payload
   * @param {string} payload.email
   * @param {string} payload.firstName
   * @param {string} payload.lastName
   * @param {bool} payload.password
   * @returns {undefined}
   */
  async payload => {
    try {
      const user = await API.updateUser(payload);
      dispatch({
        type: "RECEIVE_USER",
        payload: user
      });
      dispatchNotification()({ type: "SUCCESS", message: "Updated profile" });
    } catch (e) {
      dispatchNotification()({ type: "ERROR", message: errorToString(e) });
      return Promise.reject(e);
    }
  };

/*
 * @param {function} dispatch
 * @returns {function}
 */
export const addEmail = dispatch =>
  /*
   * @param {Object} payload
   * @param {string} payload.email
   * @returns {undefined}
   */
  async payload => {
    try {
      const user = await API.addEmail(payload);
      dispatch({
        type: "RECEIVE_USER",
        payload: user
      });
      dispatchNotification()({
        type: "SUCCESS",
        message: `Verify email sent to ${payload.email}`
      });
    } catch (e) {
      dispatchNotification()({ type: "ERROR", message: errorToString(e) });
      return Promise.reject(e);
    }
  };

/*
 * @param {function} dispatch
 * @returns {function}
 */
export const removeEmail = dispatch =>
  /*
   * @param {Object} payload
   * @param {string} payload.email
   * @returns {undefined}
   */
  async payload => {
    try {
      const user = await API.removeEmail(payload);
      dispatch({
        type: "RECEIVE_USER",
        payload: user
      });
      dispatchNotification()({
        type: "SUCCESS",
        message: `Removed ${payload.email}`
      });
    } catch (e) {
      dispatchNotification()({ type: "ERROR", message: errorToString(e) });
      return Promise.reject(e);
    }
  };

/*
 * @param {function} dispatch
 * @returns {function}
 */
export const makeEmailPrimary = dispatch =>
  /*
   * @param {Object} payload
   * @param {string} payload.email
   * @returns {undefined}
   */
  async payload => {
    try {
      const user = await API.makeEmailPrimary(payload);
      dispatch({
        type: "RECEIVE_USER",
        payload: user
      });
      dispatchNotification()({
        type: "SUCCESS",
        message: `${payload.email} is primary`
      });
    } catch (e) {
      dispatchNotification()({ type: "ERROR", message: errorToString(e) });
      return Promise.reject(e);
    }
  };

/*
 * @param {function} dispatch
 * @returns {function}
 */
export const sendResetPasswordEmail = dispatch =>
  /*
   * @returns {undefined}
   */
  async () => {
    try {
      const user = await API.updateUser({ password: true });
      dispatch({
        type: "RECEIVE_USER",
        payload: user
      });
      dispatchNotification()({
        type: "SUCCESS",
        message: "Sent password email"
      });
    } catch (e) {
      dispatchNotification()({ type: "ERROR", message: errorToString(e) });
      return Promise.reject(e);
    }
  };

/*
 * @param {function} dispatch
 * @returns {function}
 */
export const sendVerifyEmail = dispatch =>
  /*
   * @returns {undefined}
   */
  async () => {
    try {
      const user = await API.sendVerifyEmail();
      dispatch({
        type: "RECEIVE_USER",
        payload: user
      });
      dispatchNotification()({ type: "SUCCESS", message: "Sent verify email" });
    } catch (e) {
      dispatchNotification()({ type: "ERROR", message: errorToString(e) });
      return Promise.reject(e);
    }
  };

/*
 * @param {function} dispatch
 * @returns {function}
 */
export const verifyEmail = dispatch =>
  /*
   * Verifies email and logs in user if successful
   *
   * @param {Object} payload
   * @param {string} payload.signature
   * @param {string} payload.timestamp
   * @param {string} payload.userID
   * @returns {string} email
   */
  async payload => {
    try {
      const user = await API.verifyEmail(payload);
      localStorage.setItem("userToken", user.token);
      dispatch({
        type: "RECEIVE_USER",
        payload: user
      });
      dispatchNotification()({
        type: "SUCCESS",
        message: "Your email is verified"
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

/*
 * @param {function} dispatch
 * @returns {function}
 */
export const resetPassword = dispatch =>
  /*
   * Resets password and logs in user if successful
   *
   * @param {Object} payload
   * @param {string} payload.signature
   * @param {string} payload.timestamp
   * @param {string} payload.userID
   * @param {string} payload.password
   * @returns {undefined}
   */
  async payload => {
    try {
      const user = await API.resetPassword(payload);
      localStorage.setItem("userToken", user.token);
      dispatch({
        type: "RECEIVE_USER",
        payload: user
      });
      dispatchNotification()({
        type: "SUCCESS",
        message: "Your password has been set"
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

/*
 * @param {function} dispatch
 * @returns {function}
 */
export const forgotPassword = dispatch =>
  /*
   * ForgotPassword send an email to the user whose email
   * matches with a link to set their password.
   *
   * @param {Object} payload
   * @param {string} payload.email
   * @returns {Object} response
   */
  async payload => {
    try {
      const response = await API.forgotPassword(payload);
      return response;
    } catch (e) {
      dispatchNotification(dispatch)({
        type: "ERROR",
        message: errorToString(e)
      });
      return Promise.reject(e);
    }
  };

/*
 * @param {function} dispatch
 * @returns {function}
 */
export const uploadAvatar = dispatch =>
  /*
   * @param {Object} payload
   * @param {string} payload.blob
   * @param {string} payload.x
   * @param {string} payload.y
   * @param {string} payload.size
   * @returns {undefined}
   */
  async payload => {
    try {
      const user = await API.uploadAvatar(payload);
      dispatch({
        type: "RECEIVE_USER",
        payload: user
      });
      dispatchNotification()({
        type: "SUCCESS",
        message: "Avatar uploaded"
      });
    } catch (e) {
      dispatchNotification()({ type: "ERROR", message: errorToString(e) });
      return Promise.reject(e);
    }
  };
