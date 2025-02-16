/* External Imports */
import mixpanel from 'mixpanel-browser';

// Event names as constants to ensure consistency
export const MIXPANEL_EVENTS = {
  GAME_STARTED: 'personality_game_started',
  GAME_COMPLETED: 'personality_quiz_completed',
  TY_POPUP_RECEIVED: 'personality_ty_popup_received',
  TY_POPUP_CLICKED: 'personality_ty_popup_clicked'
} as const;

// Get Mixpanel token from environment variables
const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN_DEV;

// Track initialization status
let isInitialized = false;

// Initialize Mixpanel with configuration
if (MIXPANEL_TOKEN) {
  try {
    // Initialize Mixpanel
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: true, // Always enable debug mode for development
      track_pageview: true,
      persistence: 'localStorage',
      ignore_dnt: true
    });

    // Register super properties
    mixpanel.register({
      app_version: '1.0.0',
      platform: 'web',
      environment: 'development',
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      language: navigator.language
    });

    isInitialized = true;
    console.log('✅ Mixpanel initialized in development mode with token:', MIXPANEL_TOKEN);
  } catch (error) {
    console.error('❌ Failed to initialize Mixpanel:', error);
  }
} else {
  console.error('❌ Mixpanel token not found in environment variables');
}

// Type for event properties
interface EventProperties {
  [key: string]: string | number | boolean | object | any[] | undefined;
}

/**
 * Mixpanel tracking utility
 */
export const mp = {
  /**
   * Track any event with optional properties
   */
  track: (eventName: string, properties?: EventProperties) => {
    if (!isInitialized) {
      console.error('❌ Mixpanel not initialized. Event not tracked:', eventName);
      return;
    }

    try {
      mixpanel.track(eventName, {
        environment: 'development',
        ...properties
      });
      console.log('✅ Mixpanel event tracked:', eventName, properties);
    } catch (error) {
      console.error('❌ Mixpanel tracking error:', error);
    }
  },

  /**
   * Track when user starts the personality quiz
   */
  trackGameStarted: () => {
    mp.track(MIXPANEL_EVENTS.GAME_STARTED, {
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Track when user completes the quiz and gets their result
   */
  trackGameCompleted: (personalityResult: string) => {
    mp.track(MIXPANEL_EVENTS.GAME_COMPLETED, {
      personality_result: personalityResult,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Track when thank you popup is shown to the user
   */
  trackThankYouPopupReceived: () => {
    mp.track(MIXPANEL_EVENTS.TY_POPUP_RECEIVED, {
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Track when user clicks on the thank you popup
   */
  trackThankYouPopupClicked: () => {
    mp.track(MIXPANEL_EVENTS.TY_POPUP_CLICKED, {
      timestamp: new Date().toISOString()
    });
  }
};