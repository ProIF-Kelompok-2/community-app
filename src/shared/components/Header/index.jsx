import _ from 'lodash';
import React, { useState, useEffect, useReducer } from 'react';
import PT from 'prop-types';
import { config } from 'topcoder-react-utils';
import Logo from 'assets/images/tc-logo.svg';

let TopNavRef;
let LoginNavRef;

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

const MARK_AS_READ = 6969;
const MARK_ALL_AS_READ = 3431;
const DELETE = 420;

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

const reducer = (state, action) => {
  switch (action.type) {
    case MARK_AS_READ: {
      const newState = JSON.parse(JSON.stringify(state));

      for (let i = 0; i < state.notifications.length; i += 1) {
        if (state.notifications[i].id === action.payload) {
          newState.notifications[i].read = true;
          newState.notifications[i].seen = true;

          break;
        }
      }

      newState.notificationState = determineNotificationState(newState.notifications);

      return newState;
    }
    case DELETE: {
      const newState = JSON.parse(JSON.stringify(state));

      newState.notifications = newState.notifications.filter(noti => noti.id !== action.payload);
      newState.notificationState = determineNotificationState(newState.notifications);

      return newState;
    }
    case MARK_ALL_AS_READ: {
      const newState = JSON.parse(JSON.stringify(state));

      for (let i = 0; i < newState.notifications.length; i += 1) {
        newState.notifications[i].seen = true;
        newState.notifications[i].read = true;
      }

      newState.notificationState = 'none';

      return newState;
    }
    default: {
      return null;
    }
  }
};

try {
  // eslint-disable-next-line global-require
  const { TopNav, LoginNav } = require('navigation-component');
  TopNavRef = TopNav;
  LoginNavRef = LoginNav;
} catch (e) {
  // window is undefined
}

const Header = ({ profile }) => {
  const [state, dispatch] = useReducer(reducer, dummyState);
  const [activeLevel1Id, setActiveLevel1Id] = useState();
  const [path, setPath] = useState();
  const [openMore, setOpenMore] = useState(true);

  const handleChangeLevel1Id = (menuId) => {
    setActiveLevel1Id(menuId);
  };

  const handleCloseOpenMore = () => {
    setOpenMore(false);
  };

  const handleChangeOpenMore = (changedOpenMore) => {
    setOpenMore(changedOpenMore);
  };

  const handleSwitchMenu = () => {
    setActiveLevel1Id(config.HEADER_MENU[0].id);
  };

  let normalizedProfile = profile && _.clone(profile);
  if (profile) {
    normalizedProfile.photoURL = (_.has(profile, 'photoURL') && profile.photoURL !== null)
      ? `${config.CDN.PUBLIC}/avatar/${encodeURIComponent(profile.photoURL)}?size=32` : '';
  } else {
    normalizedProfile = null;
  }

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);
  if (TopNavRef) {
    return (
      <div>
        <TopNavRef
          menu={config.HEADER_MENU}
          rightMenu={(
            <LoginNavRef
              loggedIn={!_.isEmpty(profile)}
              notificationButtonState={state.notificationState}
              notifications={dummyState.notifications}
              accountMenu={config.ACCOUNT_MENU}
              switchText={config.ACCOUNT_MENU_SWITCH_TEXT}
              onSwitch={handleSwitchMenu}
              onMenuOpen={handleCloseOpenMore}
              showNotification
              profile={normalizedProfile}
              authURLs={config.HEADER_AUTH_URLS}
            />
          )}
          logo={<Logo />}
          theme={config.HEADER_MENU_THEME}
          currentLevel1Id={activeLevel1Id}
          onChangeLevel1Id={handleChangeLevel1Id}
          path={path}
          openMore={openMore}
          setOpenMore={handleChangeOpenMore}
          loggedIn={!_.isEmpty(profile)}
          profileHandle={profile ? profile.handle : ''}
        />
      </div>
    );
  }

  return (<div />);
};

Header.defaultProps = {
  profile: null,
};

Header.propTypes = {
  profile: PT.shape({
    photoURL: PT.string,
    handle: PT.string,
  }),
};

export default Header;
