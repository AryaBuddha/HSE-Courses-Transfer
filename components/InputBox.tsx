import React from "react";
import PropTypes from "prop-types";

const InputBox = ({ value, style, change }) => {
  style = style + " border-2 rounded-md p-2";
  return <input className={style} value={value} />;
};

InputBox.PropTypes = {
  value: PropTypes.string,
  style: PropTypes.string,
  change: PropTypes.func,
};

export default InputBox;
