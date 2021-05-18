import axios from "axios";
const initialData = {
  notifications: [],
};

//--------- TYPES
const GET_DATA_NOTIF = "GET_DATA_NOTIF";
const ERROR_GET_DATA_NOTIF = "ERROR_GET_DATA_NOTIF";

export default function notifReducer(state = initialData, action) {
  switch (action.type) {
    case GET_DATA_NOTIF:
      return { ...state, notifications: action.payload };
    default:
      return state;
  }
}

export const getNotifications = () => async (dispatch, getState) => {
  let data = JSON.parse(localStorage.getItem("auth"));
  if (data) {
    let config = {
      headers: {
        token: data.token,
      },
    };
    axios
      .get("http://localhost:3001/api/notifications", config)
      .then((res) => {
        let data = res.data.data;
        data.reduceRight((acc, item, index, object) => {
          if (item.readed === true) {
            object.splice(index, 1);
          }
        }, []);
        dispatch({
          type: GET_DATA_NOTIF,
          payload: data,
        });
        return;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return;
};
