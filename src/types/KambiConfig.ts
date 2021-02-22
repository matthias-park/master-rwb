interface KambiConfig {
  //The currency that should be used in ISO-4217. If not supplied, or if the currency don't correspond to the logged in players currency (back-end check), the betting client won't start and an error message will be shown. Contact Kambi for a list of supported currencies. Required for both logged in and non logged in players.
  currency: string;
  //The identifier of the player. If the player is not logged in, this parameter can be excluded. Optional.
  playerId?: string;
  //Data that will be transfer to operator backend via Kambi backend when logging in.
  customerData?: unknown;
  //The temporary ticket from the operator's SSO system. If a valid ticket is provided, the application will attempt to startup as logged in for the user. If not, the application will treat the user as not logged in. Required for logged in players
  ticket?: string;
  //The current locale of the player. Parameter should be supplied in a supported language and country format (ISO-639_ISO-3166) (e.g. sv_SE). Default language is English (en_GB). Contact Kambi for a list of supported locales.
  locale: string;
  //The current market of the player. Parameter should be supplied in a supported country format (ISO-3166) (e.g. SE). Default market is English UK (GB). Contact Kambi for a list of supported markets.
  market: string;
  //String to indicate whether streaming is allowed for the player. If set to 'false', or omitted, a "please make a deposit" message will be shown instead of the stream. If set to 'true' the "play stream" will be shown. Defaults to 'false'. Not required for non logged in players.
  streamingAllowedForPlayer?: 'true' | 'false';
  //Set a default odds format at startup. Available formats are "decimal", "fractional", "american". Default value is "decimal". If the user has manually chosen an odds format the value in the parameter is ignored. Optional. (Release in May 2013)
  oddsFormat?: string;
  //String to indicate if the client should be started in racing mode. Default value is false. Optional.
  racingMode?: 'true' | 'false';
  //String to be sent to the offering to be make the client only display live betting events selected for the specified competition. Optional.
  competitionId?: string;
}

export default KambiConfig;

//https://www.kambipartner.com/techhub/api_docs/client_documentation/how_to_integrate_the_html5_client/example_of_bettingclientsettingsjs
export interface CustomerSettings {
  /**
   * The URL location to redirect to when the user clicks on the
   * operator's logo in the header. This URL can be an absolute URL or
   * a relative URL which is relative to the HTML file.
   */
  homeUrl?: string;
  /**
   * The URL location to redirect to when the user clicks on the
   * login button in the header. This URL can be an absolute URL or
   * a relative URL which is relative to the HTML file.
   *
   * A special case: Setting loginUrl = 'notification' will
   * prevent a redirect and instead the Kambi client sends a
   * notification event 'loginRequested'.
   * see https://kambiservices.atlassian.net/wiki/display/Kambi/Catalog+of+notification+events
   */
  loginUrl?: string;
  /**
   * The URL location to redirect to when the user clicks on the lobby
   * button in the header. This URL can be an absolute URL or
   * a relative URL which is relative to the HTML file.
   */
  lobbyUrl?: string;
  /**
   * Toogles the visibility of deposit button/links.
   */
  enableDeposit?: boolean;
  /**
   * The URL location to redirect to when the user wants to deposit
   * money into his/her account. This URL can be an absolute URL or
   * a relative URL which is relative to the HTML file.
   *
   * A special case: Setting depositUrl = 'notification' will
   * prevent a redirect and instead the Kambi client sends a
   * notification event 'depositRequested'.
   * see https://kambiservices.atlassian.net/wiki/display/Kambi/Catalog+of+notification+events
   */
  depositUrl?: string;
  /**
   * Toggles live betting. When set to false no live events or live
   * bet offers will be available in the client.
   */
  enableLiveBetting?: boolean;
  /**
   * Toggles visibility of odds format selector in the client
   */
  enableOddsFormatSelector?: boolean;
  /**
   * For tracking with Google Universal Analytics.
   * Google calls this the Web Property Id and
   * calls it UA-XXXX-Y in their documentation.
   * @default ''
   */
  googleAnalyticsWebPropertyID?: string;
  /**
   * Enables live betting by phone only mode.
   * @default false
   */
  liveBettingByPhoneOnlyEnabled?: boolean;
  /**
   * Live betting by phone only:
   * The phone number to be called when a call button is activated.
   * ! Observe this is the actual number to be called !
   */
  liveBettingPhoneNumber?: string;
  /**
   * Live betting by phone only:
   * A freetext string which will replace the phone number to be called. Only for presentational use.
   *
   * Appended to a more generic message regarding Call to place bet. In dialogues etc.
   */
  liveBettingHumanReadablePhoneNumber?: string;
  /**
   * Live betting by phone only:
   * A freetext string witch will added to the more generic message regarding Call to place bet.
   *
   * It tells which regulation applies
   * E.g 'Australian regulations'
   */
  liveBettingRegulationString?: string;
  /**
   * Toggles 'My Bonus Offers' / 'My Free Bets' (bonus-offers) navigation menu item.
   * If the bonus-offers menu link is added to client by Kambi, then it is possible to hide it by setting enableMyBonusOffers?: boolean.
   * @default true
   */
  enableMyBonusOffers?: boolean;
  /**
   * Show search component:
   * @default true
   */
  enableTermSearch?: boolean;
  /**
   * Show filter component:
   * @default true
   */
  enableFilterMenu?: boolean;
  /**
   * Show UpcomingLiveFilter in filter component:
   * @default true
   */
  enableUpcomingLiveFilter?: boolean;
  /**
   * Show StreamingFilter in filter search component:
   * @default true
   */
  enableStreamingFilter?: boolean;
  /**
   * Sets the betslip to being pinned (ie always visible) in the client. It is not possible for the user to unpin it.
   * @default false
   */
  enablePinnedBetslip?: boolean;
  /**
   * Sets the betslip to being pinned (ie always visible) in the client upon starting it. It is possible for the user to unpin it. It will return to the pinned state if the client is reloaded.
   * @default false
   * NOTE: Available since version 1.517.0.0
   */
  enableBetslipInitialStatePinned?: boolean;
  /**
   * Allocate space for header element at the top of the client
   * This will reduce the height of the betting client with the number passed in (pixels) so the betting client will have the height of the viewport
   * minus the passed in fixeHeaderHeight value
   * @default 0
   */
  fixedHeaderHeight?: number;
  /**
   * Hide header component in the client
   * @default false
   */
  hideHeader?: boolean;

  /**
   * Tax percentage value can be provided as a number in this setting
   * That value will be used to calculate the tax on potential payout and show a text or link(having actual tax value) at the bottom of the betslip.
   * If the CustomerSettings has footerLinks having terms and conditions in it, the above tax text will be treated as link and will navigate to given terms and conditions link.
   * If no terms and conditions link is found in CustomerSettings footerLinks then tax will be treated as a simple text.
   *
   * Since some operators has there own tax related link/text shown at the bottom of betslip, so the operators needs to remove their link/text before using this setting
   *
   * @type Number
   * @default 0
   *
   */
  payoutTaxAmount?: number;

  /**
   * Show previously searched terms section in search component:
   *
   * @type Boolean
   * @default false
   */
  enablePreviouslySearchedTerms?: boolean /*deprecated since April 13, 2016 - its now on for all*/;
  /**
   * NOTE! Do not set routeRoot without talking to Kambi first.
   *
   * Route root can be used to set a route prefix in the # routes
   * used by the Kambi client. This is usually only needed if the operator
   * also relies on # navigation.
   *
   * @type String
   * @default undefined
   */
  routeRoot?: string;

  /**
   * Show a toaster (message) to the punter when a bet is settled.
   *
   * @type Boolean
   * @default true
   */
  enableBetSettlementToaster?: boolean;

  /**
   * Disables CashOut button in client if set to true.
   *
   * Old CashIn button is removed, but the flag name remained same.
   *
   * @type Boolean
   * @default false
   */
  disableCashIn?: boolean;

  /**
   *   Available version: 1.532.0.0
   * possibility to build the client containing only the betslip.
   * the interaction with the betslip will be done through WAPI or populate from URL (see WAPI docs and populate betslip from link docs)
   *
   * in order to use "pinned" functionality, it's needed to set the pinned selector in "betslipQuerySelectors"
   */

  loadBetslipModule?: boolean;

  /**
   *   Available version: 1.434.0.0
   * possibility to set up the containers for where the betslip should be if the default is not wished for.
   *
   * @type Object
   * pinned: element for betslip in pinned mode
   * unpinned: element for betslip in unpinned mode
   * NOTE: Overriding this setting overrides complete value so it would not merge object, it would replace it.
   */
  betslipQuerySelectors?: { pinned: string; unpinned: string };

  /**
   * Hides the entire client (including header, footer and navigation) on specified routes.
   * Example: ['home', 'filter/all/all/all/all/in-play']
   * will hide the client on start page and the live right now page (note the omitting of the hash #).
   * Note that the client will continue loading resources and updating the hidden page which can affect the browser performance.
   * The client can be made visible using WAPI (CLIENT_SHOW method).
   * RegExp string patterns can be used but without:
   * start char ^ and end char $
   *
   * @type Array of strings
   * @default []
   * NOTE: Overriding this setting overrides complete value so it would not merge array, it would replace it.
   */
  emptyClientRoutes?: string[];

  /**
   * Renders empty page in the client for specified routes
   * Example: ['^home', 'filter/all/all/all/all/in-play']
   * will render empty page instead of start page and the live right now page (note the omitting of the hash #).
   * Note that the client will not load resources and will not render the original page which is better for browser performance.
   * Therefore this setting should be preferred over "emptyClientRoutes" if the original client page is not to be used at all.
   * RegExp string patterns can be used.
   *
   * @type Array of strings
   * @default []
   * NOTE: Overriding this setting overrides complete value so it would not merge array, it would replace it.
   */
  reservedRoutes?: (string | RegExp)[];

  /**
         * Defines routes ignored by the betting client.
         * Navigating to such routes will not cause any update in the client).
         * (available from v1.648.0.0)

         * Example: ['login$', 'menu$']
         * The client will ignore any route ending with "login" or "menu".
         * RegExp string patterns can be used.
         *
         * @type Array of strings
         * @default []
         * NOTE: Overriding this setting overrides complete value so it would not merge array, it would replace it.
         */
  ignoredRoutes?: string[];

  /**
   * External visualization (available from v1.353.0.0)
   *
   * Kambi need to enable a sport - so first talk to Kambi
   *
   * Supported sports
   * AMERICAN_FOOTBALL, VOLLEYBALL, BASKETBALL, RUGBY_UNION, DARTS, ICE_HOCKEY, HANDBALL, BEACH_VOLLEYBALL, BADMINTON
   *
   * enableVisualisation.timezone
   * The timezone the visualisation will use. See https://en.wikipedia.org/wiki/
   * List_of_tz_database_time_zones for all available timezones. Default is Europe/Berlin
   *
   * enableVisualisation.colors (optional)
   * Override one or more colors in the visualisation set by Kambi. It is fine by just overriding one color.
   * The color settings originate from betradar widget center.
   * Has to be specified as a rgb-value. Ex rgb(255, 255, 255)
   *
   * enableVisualisation.BASKETBALL.enable
   * To enable a sport set the enable field to true.
   * Available sports VOLLEYBALL, BASKETBALL, RUGBY_UNION, DARTS, ICE_HOCKEY, HANDBALL, BEACH_VOLLEYBALL, BADMINTON
   *
   * enableVisualisation.BASKETBALL.colors (optional)
   * Override one or more colors in the visualisation set by enableVisualisation.colors.
   * It is fine by just overriding one color. This override will apply for the specific sport.
   * NOTE: Overriding this setting overrides complete value so it would not merge object, it would replace it.
   */
  enableVisualisation?: unknown;
  /**
   * Special branding for Sportradar (available from v1.445.0.0)
   *
   * If you have received a URL from Betradar for LMT widget then you can add them in the following settings:
   * externalVisualisationURLV2 for special branding of LMT version 2
   * externalVisualisationURLV3 for special branding of LMT version 3
   *
   * Example:
   *
   * externalVisualisationURLV2: "https://cs.betradar.com/ls/widgets/?/<your client name>/{language}/{timezone}/widgetloader/widgets",
   * externalVisualisationURLV3: "https://widgets.sir.sportradar.com/<your client name>/widgetloader"
   * with the "<your client name>" part reflecting your client name that you got from Betradar
   */
  externalVisualisationURLV2?: string;
  externalVisualisationURLV3?: string;

  /**
   * Styling of Sportradar version 3 (available from v1.445.0.0)
   *
   * To rebrand the Sportradar LMT version 3 widget you will have to create a theme in your account on betradar and host the
   * resulting css on a static URL and add it to "externalVisualisationStylingURLV3"
   *
   * Example:
   *
   * externalVisualisationStylingURLV3: "https://my.cssStash.com/ourTheme.css""
   */
  externalVisualisationStylingURLV3?: string;

  /**
   * Sports that will be added to the A-Z sports view, the sortorder is alphabetic
   * NOTE: Overriding this setting overrides complete value so it would not merge object, it would replace it.
   */
  operatorAZSports?: { href: string; name: string }[];

  /**
   * An object containing the different links that are available in the
   * account section in the client.
   *
   * Link information should be presented as an object where the name of
   * the object is the link 'type'. The 'type' is used within the app to
   * display the right icon next to the link, if applicable. The link
   * 'type' can be a pre-defined type that the client is aware of, or any
   * custom type defined by the operator.
   *
   * Each link is defined with the following properties:
   *      - url: The URL of the link
   *      - label: The label to display for the link
   *      - sortOrder: The sort order of the link. Should be a whole
   *          number. The lower the number, the higher up on the page
   *          the link should be. Sort order 1 is the first item
   *      - external: True if the link is opened in a new window or false
   *          in the same window [Optional]
   *      - skipAnimation: To skip the closing animation of the account
   *          menu when opening links
   *
   * @type Object
   * @default undefined
   * NOTE: Overriding this setting overrides complete value so it would not merge object, it would replace it.
   */
  accountLinks?: {
    [key: string]: {
      url: string;
      label: string;
      sortOrder: number;
      external: boolean;
    };
  }[];
  /**
   * An object containing the different links that are available in the
   * footer in the client.
   *
   * Link information should be presented as an object where the name of
   * the object is the link 'type'. The 'type' is used within the app to
   * display the right icon next to the link, if applicable. The link
   * 'type' can be a pre-defined type that the client is aware of, or any
   * custom type defined by the operator.
   *
   * Each link is defined with the following properties:
   *      - url: The URL of the link
   *      - label: The label to display for the link
   *      - sortOrder: The sort order of the link. Should be a whole
   *          number. The lower the number, the higher up on the page
   *          the link should be. Sort order 1 is the first item
   *      - external: True if the link is opened in a new window or false
   *          in the same window [Optional]
   *      - featured: True if the link is to be highlighted on the start
   *          page below the normal content but above all other footer
   *          links. The link will be displayed as a full-width link with
   *          a pre-defined icon on the right. [Optional]
   *
   * If the link is an image link the following should be added:
   *      - imageHref: The url to the image that should be shown as a link
   *      - label: Note that the label will be used as the 'alt' property
   *          of the HTML img tag (shown if the image URL is wrong, image
   *          type is not supported and while the image is downloading).
   *
   * @type Object
   * @default undefined
   *
   * E.g.:
   * NOTE: Overriding this setting overrides complete value so it would not merge object, it would replace it.
   */
  footerLinks?: {
    [key: string]: {
      url: string;
      label: string;
      sortOrder: number;
      external: boolean;
    };
  };
  /**
   * An object or array of objects containing the optional links to be displayed at the bottom
   * of the betslip.
   *
   * The link is defined with the following properties:
   *      - url: The URL of the link
   *      - label: The label to display for the link
   *      - external: True if the link is opened in a new window or false in
   *          the same window [Optional]
   *
   * @type Object
   * @default undefined
   * NOTE: Overriding this setting overrides complete value so it would not merge object, it would replace it.
   */
  betslipLinks?: {
    [key: string]: {
      url: string;
      label: string;
      sortOrder: number;
      external: boolean;
    };
  }[];
  /**
   * An object containing the optional links to be displayed at the bottom
   * of the bet history, below the 'More' bets link.
   *
   * The link is defined with the following properties:
   *      - url: The URL of the link
   *      - label: The label to display for the link
   *      - external: True if the link is opened in a new window or false in
   *          the same window [Optional]
   *
   * @type Object
   * @default undefined
   * NOTE: Overriding this setting overrides complete value so it would not merge object, it would replace it.
   */
  bethistoryLinks?: {
    [key: string]: {
      url: string;
      label: string;
      sortOrder: number;
      external: boolean;
    };
  };

  /**
   * An object containing the optional links to be displayed at the top
   * of the navigation panel. In development; links defined here may not appear in the client yet.
   *
   * The link is defined with the following properties:
   *      - url: The URL of the link
   *      - label: The label to display for the link
   *      - external: True if the link is opened in a new window or false in
   *          the same window [Optional]
   *
   * @type Object
   * @default undefined
   * NOTE: Overriding this setting overrides complete value so it would not merge object, it would replace it.
   */
  navigationTopLinks?: {
    [key: string]: {
      url: string;
      label: string;
      sortOrder: number;
      external: boolean;
    };
  };

  /**
   * An object containing the optional links to be displayed at the bottom
   * of the navigation panel. In development; links defined here may not appear in the client yet.
   *
   * The link is defined with the following properties:
   *      - url: The URL of the link
   *      - label: The label to display for the link
   *      - external: True if the link is opened in a new window or false in
   *          the same window [Optional]
   *
   * @type Object
   * @default undefined
   * NOTE: Overriding this setting overrides complete value so it would not merge object, it would replace it.
   */
  navigationBottomLinks?: {
    [key: string]: {
      url: string;
      label: string;
      sortOrder: number;
      external: boolean;
    };
  };

  /**
   * An object containing the optional links to be displayed at the bottom of the popular section
   * of the navigation panel. In development; links defined here may not appear in the client yet.
   *
   * The link is defined with the following properties:
   *      - url: The URL of the link
   *      - label: The label to display for the link
   *      - title: The title to show when hoover with the pointer
   *      - external: True if the link is opened in a new window or false in
   *          the same window [Optional]
   *
   * The key for the link (e.g. top-european-football) must be unique and is used for tracking navigation through this link.
   * The value of the key may be anything accepted by JavaScript. Any number of links may be added with unique keys.
   *
   * @type Object
   * @default undefined
   * NOTE: Overriding this setting overrides complete value so it would not merge object, it would replace it.
   */
  popularLinks?: {
    [key: string]: {
      url: string;
      label: string;
      sortOrder: number;
      external: boolean;
    };
  };

  /**
   * Toggles visibility of the navigation menu in the client (if browser-window is wide enough)
   *
   * @type Boolean
   * @default false
   */
  enableNavigationPanel?: boolean;

  /**
   *   States that we want to get notified when the client gets this error trying to place bets and not being logged in
   *   (see documentation about notifications for more info)
   * NOTE: Overriding this setting overrides complete value so it would not merge array, it would replace it.
   */
  customizedBetslipFeedbackTypes?: string[];

  /**
   *   Toggles visibility of the prematch stats widgets (gm-team-performance and gm-head-to-head widgets) on the event page
   *
   *   @type Object or Boolean
   * NOTE: Overriding this setting overrides complete value so it would not merge object, it would replace it.
   */
  // Enable / disable prematch stats per sport
  enablePrematchStats?: { [key: string]: boolean };
  // Enable prematch stats for all sports
  // enablePrematchStats?: boolean;

  // Disable prematch stats for all sports
  // enablePrematchStats?: boolean;

  /**
   * Enables Teaser+ for specified leagues.
   *
   * The value supplied should be the termKey for the league.
   * Note: only available for NFL for now
   *
   * @type Array of strings
   * @default []
   * NOTE: Overriding this setting overrides complete value so it would not merge array, it would replace it.
   */
  betslipTeaserLeagueIds?: string[];

  /**
   * Enables Teaser+ for specified betoffer criterion ids
   *
   * Teaser+ is enabled for Total Points - Including Overtime and Handicap - Including Overtime by default.
   * The default criterion ids will only work in production.
   * To test Teaser+ in CTN the following criterion ids needs to be supplied: [1003110754, 1003110752].
   *
   * @type Array of numbers
   * @default [1001159928, 1001159490]
   * NOTE: Overriding this setting overrides complete value so it would not merge array, it would replace it.
   */
  betslipTeaserCriterionIds?: number[];

  /**
   *  Overrides the default stream poster image
   *  Keyed by Kambi sport name (uppercase).
   *  The sport can have one image for all screen resolutions, or one for each device pixel ratio.
   *  If the device pixel ratio is higher than the highest ratio provided then the image with the closest provided ratio will be used.
   *  Only integer ratios are supported. If the device pixel ratio is not an integer then it is rounded up to the next integer.
   *  @type Object
   * NOTE: Overriding this setting overrides complete value so it would not merge object, it would replace it.
   */
  posterPhotos?: { [key: string]: any };

  /**
   *  Enables sport filter icons at the top of event list views.
   *  Released in 1.481.0.0 on 5 November 2018
   *  @type Boolean
   *  @default true
   */
  enableMultiSportsEventsFilter?: boolean;

  /**
   *  If true, the left navigation panel will behave like on mobile (hidden by default), and the hamburger menu will
   *  always be visible. If the screen resolution allows it (min. 768px), a 'Menu' label will be displayed next to
   *  the menu icon.
   *  Released in betting client v.1.492.0.0
   *  @type Boolean
   *  @default true
   */
  alwaysShowMenu?: boolean;

  /**
   * Origins of windows of third-party iframes that are allowed to communicate
   * with the Kambi client using WAPI.
   * Origin string is the concatenation of the protocol and "://", the host name if one exists,
   * and ":" followed by a port number if a port is present and differs from the default port
   * for the given protocol.
   * Examples of typical origins are https://example.org (implying port 443),
   * http://example.net (implying port 80), and http://example.com:8080
   *
   * @type string[]
   */
  wapiWhitelistedIframeOrigins?: string[];

  /**
   * Enable Lucky 15 (after yankee), 31 (after canadian) and 63 (after heinz)
   * in the system bet tab in the betslip
   * @type Boolean
   * @default false
   */
  enableLuckyBets?: boolean;

  /**
   * Enables the Kambi Client to use HTML5 History API (pushState) instead of document.location.hash
   * for changing the URL without page reload.
   *
   * The internal links in the Client have form of https://[pageurl]/filter/football
   * instead of https://[pageurl]/#filter/football
   * @type Boolean
   * @default false
   */
  enablePushState?: boolean;

  /**
   * Changes the default sorting on event lists. Valid values are "sortByLeague", "sortByTime" or undefined.
   * @type string
   * @default "sortByLeague"
   */
  defaultSortForEventGroups?: string;

  /**
   * Overrides defaultSortForEventGroups to "sortByLeague" for the sports in the array.
   * @type Array of strings
   * @default []
   * NOTE: Overriding this setting overrides complete value so it would not merge array, it would replace it.
   */
  sortEventListsByLeagueOnSports?: string[];

  /**
   * Overrides defaultSortForEventGroups to "sortByTime" for the sports in the array.
   * @type Array of strings
   * @default ["ATHLETICS", "CYCLING", "WINTER_OLYMPIC_GAMES", "WINTER_SPORTS"]
   * NOTE: Overriding this setting overrides complete value so it would not merge array, it would replace it.
   */
  sortEventListsByTimeOnSports?: string[];

  /**
   * This settings will make the betslip collapse when adding a second outcome in a desktop browser.
   * @type Boolean
   * @default false
   * NOTE: Available from version 1.531.0.0
   */
  collapseBetslipOnSecondOutcomeForDesktop?: boolean;

  /**
   * This settings will make the betslip collapse when adding a second outcome in a mobile browser.
   * @type Boolean
   * @default true
   * NOTE: Available from version 1.531.0.0
   */
  collapseBetslipOnSecondOutcomeForMobile?: boolean;

  /**
   * This settings sets animations on adding/removing outcomes to collapsed betslip.
   * @type Object
   * @default { addingOutcome: 'blink', removingOutcome: 'bounce' }
   * Currently possible values are 'blink', 'bounce', and undefined.
   * NOTE: Overriding this setting overrides complete value so it would not merge object, it would replace it.
   * NOTE: Available from version 1.533.0.0
   */
  collapsedBetslipAnimations?: { [key: string]: string };

  /**
   * This settings will make the betslip be in a compressed layout.
   * @type Boolean
   * @default true
   * NOTE: Available from version 1.531.0.0
   */
  useCompressedBetslip?: boolean;

  /**
   * This settings will hide the tabs in betslip when there is only one bet(outcome) added to it.
   * @type Boolean
   * @default true
   * NOTE: Available from version 1.531.0.0
   */
  hideBetslipTabsForOneSelectedBet?: boolean;

  /**
   * This settings will show the balance and login/logout in header (to the right of the search bar).
   * @type Boolean
   * @default false
   * NOTE: Available from version 1.529.0.0
   */
  showBalanceLoginInHeader?: boolean;

  /**
   * Sets higher priority for ClientApi component loading during the start-up of the client.
   * It makes WAPI ready to communicate with the client earlier.
   * Note that enabling this setting increases the time of initial loading and rendering of the client.
   * @type Boolean
   * @default false
   * NOTE: Available from version 1.605.0.0
   */
  prioritiseClientApiLoading?: boolean;
  /**
   * Returns the current balance of the logged in user. This function returns
   * data asynchronously by the use of callback functions.
   *
   * The success function should be called when the operator's request for the
   * balance is successful. The success function should be supplied with
   * the balance (Number) as a parameter.
   *
   * The failure function should be called when the operator's request for the
   * balance has failed. The failure function should be supplied with the
   * XMLHttpRequest object as a parameter.
   *
   * @param {Function} successFunc Success callback function
   * @param {Function} failureFunc Failure callback function
   * @param {Function} $ Reference to jQuery library, loaded internally
   */
  getBalance?: (
    success: (balance: number) => void,
    failure: (err: any) => void,
    $: any,
  ) => void;
  /**
   * Inform the operator that the current user should be logged out.
   *
   * It is the responsibility of the operator to make sure that the user is
   * logged out and that the HTML page is reloaded afterwards.
   *
   * @param {Function} $ Reference to jQuery library, loaded internally
   */
  logout?: ($: any) => Promise<void>;
  /**
   * Inform the operator to keep the logged in users session alive.
   * Called with an interval of 120 seconds as long as user interacts with the client.
   *
   * @param {Function} $ Reference to jQuery library, loaded internally
   */
  heartbeat?: ($: any) => Promise<void>;
  /**
   * Register a callback that is called once with its own callback to be called to keep the client session alive.
   * It will register a custom interaction and in the end of the heartbeat trigger the heartbeat as like any other interaction
   *
   * @param {Function} cb Callback to trigger when interaction happens
   *
   * Example:
   * CustomerSettings.prototype.registerKeepAliveCallback(function (userInteractedWithOperator) {
   *  operatorContainerElement.addEventListerner('click', userInteractedWithOperator, false)
   * });
   */
  registerKeepAliveCallback?: (callback: any) => void;

  /**
   * Informs the operator with app specific events.
   * See https://kambiservices.atlassian.net/wiki/display/Kambi/Catalog+of+notification+events for catalog of notification events
   * @param {Object} event
   * @param {Function} $ Reference to jQuery library, loaded internally
   */
  notification?: (event: any, $: any) => void;
  /**
   * event object has the following property {name: 'eventName'}
   */

  /**
   * Inform the operator that the user clicked on event statistics link icon in event page or league view.
   * The operator can use this information to show the punter more statistics about the event.
   * If this setting is defined then a statistics icon will be rendered in the client.
   *
   * @param {String} eventId Event id (kambi event id)
   * @param {Function} $ Reference to jQuery library, loaded internally
   */
  showEventStatistics?: (eventId: string, $: any) => void;

  /**
   * Version available: 1.434.0.0 (Edit: 11/4 2018)
   * If the operator wants to act when the client navigates to event that does not exist or faulty filterparameters.
   *
   * @param {String} url where the client tried to navigate
   *
   * If the operator wants the default behaviour of the client in this case (that it navigates to the start-page)
   * the function should return true, otherwise return false
   *
   */
  handle404?: (url: string) => void;

  /**
   * Version available: TBC
   * Used to enable the operator to take control over fullscreen video playback.
   * To indicate that the operator would like to take control, they should return true from onStreamFullscreen.
   * To indicate that Kambi should take control, they should return false.
   *
   * @param {Object} data
   * @param {number} data.eventId - The Kambi event ID associated with the stream
   * @param {String} data.streamFormat - The format of the stream. Currently only HLS is supported.
   * @param {String} [data.streamUrl] - The URL of the stream. This is optional because onStreamFullscreen is called first
   *     without the stream URL because the URLs may expire, and so a new URL must be fetched if the operator does
   *     want to take over fullscreen.
   * @param {function()} [data.fetchStreamUrl] - Callback which, when called, causes the Kambi client to fetch a new stream
   * URL, which is then provided by calling onStreamFullscreen again with the new URL. Useful if the provided
   *     streamUrl expires. Provided only when streamUrl is provided
   * @param {function()} [data.onExitFullscreen] - Callback which, when called, notifies the Kambi client that fullscreen
   *     was exited. Provided only when streamUrl is provided
   *
   * @returns {boolean} Whether the operator will take control over fullscreen video playback.
   *
   */
  ConStreamFullscreen?: ({
    eventId,
    streamFormat,
    streamUrl,
    fetchStreamUrl,
    onExitFullscreen,
  }: any) => boolean;
}

export interface WidgetAPI {
  request: (key: string, ...args: any[]) => unknown;
  set: (key: string, ...args: any[]) => unknown;
  navigateClient: (path: string, widget: string) => void;
  ua: Ua;
  VERSION: string;
  BETSLIP_OUTCOMES_ARGS: BetslipOutcomesArgs;
  PLACE_BET_STATE_VALUE: PlaceBetStateValue;
  BET_TYPE: BetType;
  BETSLIP_STAKE_UPDATED_TYPES: BetslipStakeUpdatedTypes;
  EVENT_INFO_TYPES: EventInfoTypes;
  EVENT_INFO_CONTEXT: EventInfoContext;
  FETCH_COUPON_STATUS: FetchCouponStatus;
  LOGOUT_REASONS: LogoutReasons;
  ODDS_FORMAT_TYPES: OddsFormatTypes;
  FEEDBACK_MESSAGE_TYPES: { [key: string]: string };
  IFRAME_READY: string;
  REMOVE: string;
  NAVIGATE: string;
  BET_HISTORY: string;
  BETSLIP_OUTCOMES_REMOVE: string;
  BETSLIP_OUTCOMES: string;
  BETSLIP_MAXIMIZED: string;
  BETSLIP_MAXIMIZED_CHANGE: string;
  BETSLIP_STAKE_UPDATED: string;
  BETSLIP_UPDATE_STAKE: string;
  EVENT_INFO: string;
  EVENT_INFO_UNSUBSCRIBE: string;
  PLACE_BET: string;
  CLIENT_ODDS_FORMAT: string;
  PLACE_BET_STATE: string;
  PLACE_BET_FAILURE_REASON: string;
  PAGE_INFO: string;
  USER_LOGGED_IN: string;
  USER_SESSION_CHANGE: string;
  USER_DATA: string;
  CLIENT_CONFIG: string;
  VERSIONS: string;
  ODDS_FRACTIONAL: string;
  ODDS_AMERICAN: string;
  LIBS: string;
  WIDGET_ARGS: string;
  WIDGET_HEIGHT: string;
  WIDGET_ENABLE_TRANSITION: string;
  WIDGET_DISABLE_TRANSITION: string;
  WIDGET_SETUP: string;
  LOGIN: string;
  LOGOUT: string;
  CLIENT_HIDE: string;
  CLIENT_SHOW: string;
  TRACK_EXTERNAL_INTERACTION: string;
  BETSLIP_HIDE: string;
  BETSLIP_SHOW: string;
  BETSLIP_CLEAR: string;
  REWARDS: string;
  KAMBI_REQUEST_CLIENT_READY_RESPONSE: string;
  KAMBI_RESPOND_CLIENT_READY: string;
  START_TUTORIAL: string;
  DISABLE_CASH_OUT: string;
  ENABLE_CASH_OUT: string;
}

export interface BetslipOutcomesArgs {
  UPDATE_REPLACE: string;
  UPDATE_APPEND: string;
  TYPE_SINGLE: string;
  TYPE_COMBINATION: string;
  TYPE_SYSTEM: string;
  TYPE_PATENT: string;
  TYPE_TRIXIE: string;
  TYPE_YANKEE: string;
  TYPE_CANADIAN: string;
  TYPE_HEINZ: string;
  TYPE_SUPERHEINZ: string;
}

export interface BetslipStakeUpdatedTypes {
  STAKE_UPDATE_TYPE_SINGLE: string;
  STAKE_UPDATE_TYPE_COMBINATION: string;
  STAKE_UPDATE_TYPE_SYSTEM: string;
}

export interface BetType {
  SINGLE: string;
  COMBINATION: string;
  SYSTEM: string;
}

export interface EventInfoContext {
  LIVE: string;
  PRE_MATCH: string;
}

export interface EventInfoTypes {
  BASIC: string;
  BET_OFFERS: string;
  SCORE: string;
}

export interface FetchCouponStatus {
  PENDING: string;
  SETTLED: string;
  WON: string;
  LOST: string;
  VOID: string;
  CASH_OUT: string;
  CASHED_OUT: string;
  ALL: string;
  REWARDS: string;
}

export interface LogoutReasons {
  SESSION_TIMED_OUT: string;
  LOGOUT_REQUESTED: string;
  LOGIN_FAILED: string;
}

export interface OddsFormatTypes {
  DECIMAL: string;
  FRACTIONAL: string;
  AMERICAN: string;
}

export interface PlaceBetStateValue {
  PLACING: string;
  SUCCEEDED: string;
  FAILED: string;
}

export interface Ua {
  source: string;
  browser: Browser;
  os: Browser;
  device: Device;
}

export interface Browser {
  family: string;
  major: number | null;
  minor: number | null;
  patch: number | null;
  name: string;
  version: string;
}

export interface Device {
  family: string;
  type: string;
  manufacturer: null;
}
