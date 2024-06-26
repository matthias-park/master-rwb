/* eslint-disable default-case */
var whl = (function (window, JSON) {
  // listen for Sportsbook frame activity
  var events = ['mousedown', 'keypress', 'scroll', 'touchstart', 'load'];

  var postMessage = event => {
    var json = JSON.stringify(event);
    if (typeof window.SBTechAndroid != 'undefined') {
      window.SBTechAndroid.jsEvent(json);
    } else {
      window.parent.postMessage(json, '*');
    }
  };

  window.addEventListener('message', receiveMessage);
  window.androidEvent = data => receiveMessage({ data });

  var sbtechCallbacks = {
    LOAD_BETSLIP: () => {
      return false;
    },
    SBT_REFRESH_SESSION: () => {
      return false;
    },
    SBT_STATUS: () => {
      return false;
    },
    SBT_ACTIVITY: () => {
      return false;
    },
    TOGGLE_HAMBURGER_MENU: () => {
      return false;
    },
    GOTO_BETTING_HISTORY_EVENT: () => {
      return false;
    },
    SBT_LOGOUT: () => {
      return false;
    },
    SBT_LOGIN: () => {
      return false;
    },
    SBT_NAVIGATE: () => {
      return false;
    },
    SBT_BETSLIP: () => {
      return false;
    },
    SBT_NAVIGATE_HOME: () => {
      return false;
    },
    NO_OVERFLOW: () => {
      document.body.style = 'overflow: hidden';
      return true;
    },
    UPDATE_GEOLOCATON_STATUS: () => {
      return false;
    },
  };
  function receiveMessage(event) {
    let json;
    try {
      json = JSON.parse(event.data);
    } catch {
      return false;
    }

    if (json === null) {
      return false;
    }

    let eventType = json.eventType;
    let eventData = json.eventData;

    if (typeof eventType == 'undefined') {
      return false;
    }
    switch (eventType.toUpperCase()) {
      case 'LOAD_BETSLIP_CALLBACK':
        sbtechCallbacks['LOAD_BETSLIP']();
        return true;
      case 'TOGGLE_HAMBURGER_MENU_CALLBACK':
        sbtechCallbacks['TOGGLE_HAMBURGER_MENU']();
        postMessage(
          {
            eventType: 'SCROLL_UP',
          },
          '*',
        );
        return true;
      case 'GOTO_BETTING_HISTORY_EVENT_CALLBACK':
        sbtechCallbacks['GOTO_BETTING_HISTORY_EVENT']();
        postMessage(
          {
            eventType: 'SCROLL_UP',
          },
          '*',
        );
        return true;
      case 'SBT_REFRESH_SESSION_CALLBACK':
        sbtechCallbacks['SBT_REFRESH_SESSION'](eventData);
        return true;
      case 'SBT_STATUS_CALLBACK':
        sbtechCallbacks['SBT_STATUS'](eventData);
        return true;
      case 'SBT_ACTIVITY_CALLBACK':
        sbtechCallbacks['SBT_ACTIVITY'](eventData);
        return true;
      case 'SBT_LOGOUT_CALLBACK':
        sbtechCallbacks['SBT_LOGOUT']();
        return true;
      case 'SBT_LOGIN_CALLBACK':
        sbtechCallbacks['SBT_LOGIN'](eventData);
        return true;
      case 'SBT_NAVIGATE_CALLBACK':
        sbtechCallbacks['SBT_NAVIGATE'](eventData);
        return true;
      case 'SBT_NAVIGATE_HOME_CALLBACK':
        sbtechCallbacks['SBT_NAVIGATE_HOME']();
        return true;
      case 'SBT_SET_NO_OVERFLOW':
        sbtechCallbacks['NO_OVERFLOW']();
        return true;
      case 'UPDATE_GEOLOCATION_STATUS_CALLBACK':
        sbtechCallbacks['UPDATE_GEOLOCATON_STATUS'](eventData);
        return true;
      default:
        return false;
    }
  }

  postMessage({
    eventType: 'SBT_READY',
  });

  function activity(callback) {
    sbtechCallbacks['SBT_ACTIVITY'] = callback;
    postMessage(
      {
        eventType: 'SBT_ACTIVITY',
        eventData: callback,
      },
      '*',
    );
  }

  function status(callback) {
    sbtechCallbacks['SBT_STATUS'] = callback;
    postMessage(
      {
        eventType: 'SBT_STATUS',
        eventData: callback,
      },
      '*',
    );
  }

  function registerLogoutCallback(callback) {
    sbtechCallbacks['SBT_LOGOUT'] = callback;
  }

  function refreshSession(callback) {
    sbtechCallbacks['SBT_REFRESH_SESSION'] = callback;
    postMessage(
      {
        eventType: 'SBT_REFRESH_SESSION',
      },
      '*',
    );
  }

  function scrollToTop() {
    window.scroll(0, 0);
    postMessage(
      {
        eventType: 'SCROLL_UP',
      },
      '*',
    );
  }

  function setDeviceTypeAndOrientation(deviceDetails) {
    if (deviceDetails) {
      postMessage(
        {
          eventType: 'SBT_SET_DEVICE_TYPE',
          eventData: deviceDetails,
        },
        '*',
      );
    }
  }

  function setBetSlipItemsCount(betslipCount) {
    postMessage(
      {
        eventType: 'SBT_SET_BETSLIP_COUNT',
        eventData: betslipCount,
      },
      '*',
    );
  }

  function setOpenBetsItemCount(openBetsCount) {
    postMessage(
      {
        eventType: 'SBT_SET_OPENBET_COUNT',
        eventData: openBetsCount,
      },
      '*',
    );
  }

  function registerGoToResponsiveBetSlipCallback(
    goToResponsiveBetSlipCallback,
  ) {
    sbtechCallbacks['LOAD_BETSLIP'] = goToResponsiveBetSlipCallback;
  }

  function registerGoToHamburgerMenuCallback(toggleHamburgerMenu) {
    sbtechCallbacks['TOGGLE_HAMBURGER_MENU'] = toggleHamburgerMenu;
  }

  function registerGoToBettingHistoryCallback(goToBettingHistoryCallback) {
    sbtechCallbacks['GOTO_BETTING_HISTORY_EVENT'] = goToBettingHistoryCallback;
  }

  function logout() {
    window.scroll(0, 0);
    postMessage(
      {
        eventType: 'SBT_LOGOUT',
      },
      '*',
    );
  }

  function registerLoginCallback(callback) {
    sbtechCallbacks['SBT_LOGIN'] = callback;
    postMessage(
      {
        eventType: 'SBT_LOGIN_READY',
      },
      '*',
    );
  }

  function registerNavigateToCallback(callback) {
    sbtechCallbacks['SBT_NAVIGATE'] = callback;
  }
  function registerGoToHomeCallback(callback) {
    sbtechCallbacks['SBT_NAVIGATE_HOME'] = callback;
  }
  function setCurrentLocationMobile(location) {
    postMessage(
      {
        eventType: 'SBT_LOCATION',
        eventData: location,
      },
      '*',
    );
  }
  function registerUpdateGeolocationStatusCallback(callback) {
    sbtechCallbacks['UPDATE_GEOLOCATON_STATUS'] = callback;
  }

  return {
    activity: activity,
    logout: logout,
    status: status,
    registerLogoutCallback: registerLogoutCallback,
    refreshSession: refreshSession,
    scrollToTop: scrollToTop,
    setDeviceTypeAndOrientation: setDeviceTypeAndOrientation,
    setBetSlipItemsCount: setBetSlipItemsCount,
    setOpenBetsItemCount: setOpenBetsItemCount,
    registerGoToResponsiveBetSlipCallback: registerGoToResponsiveBetSlipCallback,
    registerGoToHamburgerMenuCallback: registerGoToHamburgerMenuCallback,
    registerGoToBettingHistoryCallback: registerGoToBettingHistoryCallback,
    registerLoginCallback,
    registerNavigateToCallback,
    registerGoToHomeCallback,
    setCurrentLocationMobile,
    registerUpdateGeolocationStatusCallback: registerUpdateGeolocationStatusCallback,
  };
})(window, JSON);
