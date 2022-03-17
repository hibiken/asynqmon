// Prefix used for go template
const goTmplActionPrefix = "/[[";

// paseses flags (string values) assigned under the window objects by server.
export default function parseFlagsUnderWindow() {
  // ROOT_PATH
  if (window.FLAG_ROOT_PATH === undefined) {
    console.log("ROOT_PATH is not defined. Falling back to emtpy string");
    window.ROOT_PATH = "";
  } else {
    window.ROOT_PATH = window.FLAG_ROOT_PATH;
  }

  // PROMETHEUS_SERVER_ADDRESS
  if (window.FLAG_PROMETHEUS_SERVER_ADDRESS === undefined) {
    console.log(
      "PROMETHEUS_SERVER_ADDRESS is not defined. Falling back to emtpy string"
    );
    window.PROMETHEUS_SERVER_ADDRESS = "";
  } else if (
    window.FLAG_PROMETHEUS_SERVER_ADDRESS.startsWith(goTmplActionPrefix)
  ) {
    console.log(
      "PROMETHEUS_SERVER_ADDRESS was not evaluated by the server. Falling back to empty string"
    );
    window.PROMETHEUS_SERVER_ADDRESS = "";
  } else {
      window.PROMETHEUS_SERVER_ADDRESS = window.FLAG_PROMETHEUS_SERVER_ADDRESS;
  }

  // READ_ONLY
  if (window.FLAG_READ_ONLY === undefined) {
    console.log("READ_ONLY is not defined. Falling back to false");
    window.READ_ONLY = false;
  } else if (window.FLAG_READ_ONLY.startsWith(goTmplActionPrefix)) {
    console.log(
      "READ_ONLY was not evaluated by the server. Falling back to false"
    );
    window.READ_ONLY = false;
  } else {
    window.READ_ONLY = window.FLAG_READ_ONLY === "true";
  }
}
