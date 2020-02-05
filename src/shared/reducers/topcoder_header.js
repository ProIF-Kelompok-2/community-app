/**
 * Reducer for state.topcoderHeader. This part of the state holds data
 * related to the standard Topcoder header.
 */

import _ from 'lodash';
import actions from 'actions/topcoder_header';
import { handleActions } from 'redux-actions';

function determineNotificationState(notifications) {
  const newNoti = notifications.some(noti => !noti.seen);
  const unreadNoti = notifications.some(noti => !noti.read);

  if (newNoti) {
    return 'new';
  }

  if (unreadNoti) {
    return 'seen';
  }

  return 'none';
}

const dateDummy = new Date();

const dummyState = {
  notifications: [
    {
      id: '1',
      category: 'ProIF Challenge',
      read: true,
      seen: true,
      timestamp: dateDummy.setDate(dateDummy.getDate() - 1),
      content: 'Notifications testing',
      completed: false,
    },
    {
      id: '2',
      category: 'ProIF Challenge',
      read: false,
      seen: true,
      timestamp: dateDummy.setDate(dateDummy.getDate() - 2),
      content: 'Read This',
      completed: false,
    },
    {
      id: '3',
      category: 'ProSI Challenge',
      read: false,
      seen: false,
      timestamp: dateDummy.setDate(dateDummy.getDate() - 3),
      content: 'ProSI is challenging!!!',
      completed: false,
    },
    {
      id: '4',
      category: 'MIBD Challenge',
      read: true,
      seen: true,
      timestamp: dateDummy.setDate(dateDummy.getDate() - 10),
      content: '',
      completed: true,
    },
  ],
  notificationState: 'new',
};

/**
 * Creates a new reducer with the specified initial state.
 * @param {Object} initialState Optional. Initial state.
 * @return Reducer.
 */
function create(initialState = dummyState) {
  const a = actions.topcoderHeader;

  return handleActions({
    [a.closeMenu](state) {
      return {
        ...state,
        openedMenu: null,
        isMobile: false,
      };
    },
    [a.closeMobileMenu](state) {
      return {
        ...state,
        mobileMenuOpened: false,
      };
    },
    [a.closeSearch](state) {
      return {
        ...state,
        searchOpened: false,
        isMobile: false,
      };
    },
    [a.openMenu](state, action) {
      return {
        ...state,
        openedMenu: action.payload.menu,
        isMobile: state.isMobile || action.payload.isMobile,
        activeTrigger: action.payload.trigger,
      };
    },
    [a.openMobileMenu]: state => ({
      ...state,
      mobileMenuOpened: true,
    }),
    [a.openSearch]: (state, action) => ({
      ...state,
      searchOpened: true,
      activeTrigger: action.payload.trigger,
    }),
    [a.setCurrentNav]: (state, { payload }) => ({
      ...state,
      currentNav: payload,
    }),
    [a.markAsRead]: (state, { id }) => {
      const newState = JSON.parse(JSON.stringify(state));

      for (let i = 0; i < state.notifications.length; i += 1) {
        if (state.notifications[i].id === id) {
          newState.notifications[i].read = true;
          newState.notifications[i].seen = true;

          break;
        }
      }

      newState.notificationState = determineNotificationState(newState.notifications);

      return newState;
    },
    [a.deleteNotification]: (state, { id }) => {
      const newState = JSON.parse(JSON.stringify(state));

      newState.notifications = newState.notifications.filter(noti => noti.id !== id);
      newState.notificationState = determineNotificationState(newState.notifications);

      return newState;
    },
    [a.markAllAsRead]: (state) => {
      const newState = JSON.parse(JSON.stringify(state));

      for (let i = 0; i < newState.notifications.length; i += 1) {
        newState.notifications[i].seen = true;
        newState.notifications[i].read = true;
      }

      newState.notificationState = 'none';

      return newState;
    },
  }, _.defaults(_.clone(initialState), {
    currentNav: {},
  }));
}

/* Default reducer with empty initial state. */
export default create();
