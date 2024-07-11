import { notification } from "antd";
import codeMessage from "./codeMessage";

const successHandler = (response, typeNotification = {}) => {
  const { data, meta } = response;

  if (!data || data.length === 0) {
    response = {
      ...response,
      status: 404,
      url: null,
      data: {
        success: false,
        result: null,
      },
    };
  } else {
    response.data = {
      success: true,
      result: data,
      meta: meta,
    };
  }

  if (response.data.success === false) {
    const message = response.data.message || codeMessage[response.status];
    notification.config({
      duration: 10,
    });
    notification.error({
      message: `Request error ${response.status}`,
      description: message,
    });
  } else {
    const message = response.data.message || codeMessage[response.status];
    notification.config({
      duration: 10,
    });
    notification.success({
      message: `Request success`,
      description: message,
    });
  }

  return response.data;
};

export default successHandler;
