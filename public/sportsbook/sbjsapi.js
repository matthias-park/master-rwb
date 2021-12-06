/* eslint-disable default-case */
var whl = (function (window, JSON) {
  // listen for Sportsbook frame activity
  document.body.style = 'overflow: hidden';
  var events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
  events.forEach(function (name) {
    let message = JSON.stringify({ eventType: 'SBT_ACTIVITY', eventData: '' });
    window.document.addEventListener(
      name,
      () => {
        window.postMessage(message, '*');
      },
      true,
    );
  });

  window.addEventListener('message', receiveMessage);

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
  };
  function receiveMessage(event) {
    let json = JSON.parse(event.data);

    if (json === null) {
      return;
    }

    let eventType = json.eventType;
    let eventData = json.eventData;

    if (typeof eventType !== 'undefined') {
      switch (eventType.toUpperCase()) {
        case 'LOAD_BETSLIP_CALLBACK':
          sbtechCallbacks['LOAD_BETSLIP']();
        case 'TOGGLE_HAMBURGER_MENU_CALLBACK':
        case 'GOTO_BETTING_HISTORY_EVENT_CALLBACK':
          sbtechCallbacks[eventType.toUpperCase()]();
          window.parent.postMessage(
            JSON.stringify({
              eventType: 'SCROLL_UP',
            }),
            '*',
          );
          break;
        case 'SBT_REFRESH_SESSION_CALLBACK':
          sbtechCallbacks['SBT_REFRESH_SESSION'](eventData);
          break;
        case 'SBT_STATUS_CALLBACK':
          sbtechCallbacks['SBT_STATUS'](eventData);
          break;
        case 'SBT_ACTIVITY_CALLBACK':
          sbtechCallbacks['SBT_ACTIVITY'](eventData);
          break;
        case 'SBT_LOGOUT_CALLBACK':
          sbtechCallbacks['SBT_LOGOUT']();
          break;
        case 'SBT_LOGIN_CALLBACK':
          sbtechCallbacks['SBT_LOGIN'](eventData);
          break;
        case 'SBT_NAVIGATE_CALLBACK':
          sbtechCallbacks['SBT_NAVIGATE'](eventData);
          break;
        case 'SBT_NAVIGATE_HOME_CALLBACK':
          sbtechCallbacks['SBT_NAVIGATE_HOME']();
          break;
      }
    }
  }

  function activity(callback) {
    console.log('activity', callback);
    sbtechCallbacks['SBT_ACTIVITY'] = callback;
    window.parent.postMessage(
      JSON.stringify({
        eventType: 'SBT_ACTIVITY',
        eventData: callback,
      }),
      '*',
    );
  }

  function status(callback) {
    console.log('status', callback);
    sbtechCallbacks['SBT_STATUS'] = callback;
    window.parent.postMessage(
      JSON.stringify({
        eventType: 'SBT_STATUS',
        eventData: callback,
      }),
      '*',
    );
  }

  function registerLogoutCallback(callback) {
    sbtechCallbacks['SBT_LOGOUT'] = callback;
  }

  function refreshSession(callback) {
    console.log('refreshSession', callback);
    sbtechCallbacks['SBT_REFRESH_SESSION'] = callback;
    window.parent.postMessage(
      JSON.stringify({
        eventType: 'SBT_REFRESH_SESSION',
      }),
      '*',
    );
  }

  function scrollToTop() {
    window.scroll(0, 0);
    console.log('scrollToTop');
    window.parent.postMessage(
      JSON.stringify({
        eventType: 'SCROLL_UP',
      }),
      '*',
    );
  }

  function setDeviceTypeAndOrientation(deviceDetails) {
    console.log('setDeviceTypeAndOrientation', deviceDetails);

    if (deviceDetails) {
      window.parent.postMessage(
        JSON.stringify({
          eventType: 'SBT_SET_DEVIVCE_TYPE',
          eventData: deviceDetails,
        }),
        '*',
      );
    }
  }

  function setBetSlipItemsCount(betslipCount) {
    console.log('setBetSlipItemsCount', betslipCount);

    window.parent.postMessage(
      JSON.stringify({
        eventType: 'SBT_SET_BETSLIP_COUNT',
        eventData: betslipCount,
      }),
      '*',
    );
  }

  function setOpenBetsItemCount(openBetsCount) {
    console.log('setOpenBetsItemCount', openBetsCount);
    window.parent.postMessage(
      JSON.stringify({
        eventType: 'SBT_SET_OPENBET_COUNT',
        eventData: openBetsCount,
      }),
      '*',
    );
  }

  function registerGoToResponsiveBetSlipCallback(
    goToResponsiveBetSlipCallback,
  ) {
    sbtechCallbacks['LOAD_BETSLIP'] = goToResponsiveBetSlipCallback;
  }

  function registerGoToHamburgerMenuCallback(toggleHamburgerMenu) {
    // var toggleHamburgerMenu = function () {
    //   ToggleMainNavigation.toggle();
    // };
    sbtechCallbacks['TOGGLE_HAMBURGER_MENU'] = toggleHamburgerMenu;
  }

  function registerGoToBettingHistoryCallback(goToBettingHistoryCallback) {
    sbtechCallbacks['GOTO_BETTING_HISTORY_EVENT'] = goToBettingHistoryCallback;
    console.log(
      'registerGoToBettingHistoryCallback',
      goToBettingHistoryCallback,
    );
  }

  function logout() {
    console.log('--------- LOGOUT() called--------');
    window.scroll(0, 0);
    window.parent.postMessage(
      JSON.stringify({
        eventType: 'SBT_LOGOUT',
      }),
      '*',
    );
  }

  function registerLoginCallback(callback) {
    console.log('login callback registered');
    sbtechCallbacks['SBT_LOGIN'] = callback;
    window.parent.postMessage(
      JSON.stringify({
        eventType: 'SBT_LOGIN_READY',
      }),
      '*',
    );
  }

  function registerNavigateToCallback(callback) {
    console.log('navigate to callback registered');
    console.log(callback);
    sbtechCallbacks['SBT_NAVIGATE'] = callback;
  }
  function registerGoToHomeCallback(callback) {
    sbtechCallbacks['SBT_NAVIGATE_HOME'] = callback;
  }
  function setCurrentLocationMobile(location) {
    window.parent.postMessage(
      JSON.stringify({
        eventType: 'SBT_LOCATION',
        eventData: location,
      }),
      '*',
    );
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
  };
})(window, JSON);
