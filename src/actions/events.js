import * as API from "../api/events";
import { dispatchNotification } from "./notifications";
import { errorToString } from "../utils";
import { setSelectedResource } from "./general";

/*
 * @param {function} dispatch
 * @returns {function}
 */
export const fetchEvents = dispatch =>
  /*
   * @returns {undefined}
   */
  async () => {
    try {
      const response = await API.getEvents();
      dispatch({
        type: "RECEIVE_EVENTS",
        payload: response.events
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
export const createEvent = dispatch =>
  /*
   * @param {Object} payload
   * @param {string} payload.name
   * @param {string} payload.placeId
   * @param {datetime} payload.time
   * @param {Contact[]} payload.users
   * @param {string} payload.description
   * @returns {Object} Event
   */
  async payload => {
    let event;
    try {
      event = await API.createEvent(payload);
      dispatch({
        type: "RECEIVE_EVENTS",
        payload: [event]
      });
    } catch (e) {
      dispatchNotification()({ type: "ERROR", message: errorToString(e) });
      return Promise.reject(e);
    }

    return event;
  };

/*
 * @param {function} dispatch
 * @returns {function}
 */
export const updateEvent = dispatch =>
  /*
   * @param {Object} payload
   * @param {Object} payload.id
   * @param {string} payload.name
   * @param {string} payload.placeId
   * @param {string} payload.address
   * @param {datetime} payload.time
   * @param {string} payload.description
   * @returns {Object} Event
   */
  async payload => {
    let event;
    try {
      event = await API.updateEvent(payload.id, payload);
      dispatch({
        type: "RECEIVE_EVENTS",
        payload: [event]
      });
      dispatchNotification()({ type: "SUCCESS", message: "Updated event" });
    } catch (e) {
      dispatchNotification()({ type: "ERROR", message: errorToString(e) });
      return Promise.reject(e);
    }

    return event;
  };

/*
 * @param {function} dispatch
 * @returns {function}
 */
export const addUserToEvent = dispatch =>
  /*
   * @param {Object} payload
   * @param {Object} payload.event
   * @param {Object} payload.user
   * @returns {Object} Event
   */
  async payload => {
    let event;
    try {
      event = await API.addUserToEvent(payload.event.id, payload.user.id);
      dispatch({
        type: "RECEIVE_EVENTS",
        payload: [event]
      });
      dispatchNotification()({
        type: "SUCCESS",
        message: `Added ${payload.user.fullName} to ${payload.event.name}`
      });
    } catch (e) {
      dispatchNotification()({ type: "ERROR", message: errorToString(e) });
      return Promise.reject(e);
    }

    return event;
  };

/*
 * @param {function} dispatch
 * @returns {function}
 */
export const removeUserFromEvent = dispatch =>
  /*
   * @param {Object} payload
   * @param {Object} payload.event
   * @param {Object} payload.user
   * @param {bool} payload.removeEvent
   * @returns {Object} Event
   */
  async payload => {
    let event;
    try {
      event = await API.removeUserFromEvent(payload.event.id, payload.user.id);

      if (payload.removeEvent) {
        dispatch({
          type: "DELETE_EVENT",
          payload: event.id
        });
      } else {
        dispatch({
          type: "RECEIVE_EVENTS",
          payload: [event]
        });
      }

      dispatchNotification()({
        type: "SUCCESS",
        message: `Removed ${payload.user.fullName} from ${payload.event.name}`
      });
    } catch (e) {
      dispatchNotification()({ type: "ERROR", message: errorToString(e) });
      return Promise.reject(e);
    }

    return event;
  };

/*
 * @param {function} dispatch
 * @returns {function}
 */
export const deleteEvent = dispatch =>
  /*
   * @param {Object} payload
   * @param {Object} payload.event
   * @returns {undefined}
   */
  async payload => {
    try {
      await API.deleteEvent(payload.event.id);
      dispatch({
        type: "DELETE_EVENT",
        payload: payload.event.id
      });
      dispatchNotification()({
        type: "SUCCESS",
        message: `Deleted ${payload.event.name}`
      });
      setSelectedResource(dispatch)();
    } catch (e) {
      dispatchNotification()({ type: "ERROR", message: errorToString(e) });
      return Promise.reject(e);
    }
  };