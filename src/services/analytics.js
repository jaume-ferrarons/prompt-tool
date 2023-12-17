import ReactGA from "react-ga4";

const trackEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
}

const pageView = (location) => {
  ReactGA.send({ hitType: "pageview", page: location });
}

export { trackEvent, pageView };