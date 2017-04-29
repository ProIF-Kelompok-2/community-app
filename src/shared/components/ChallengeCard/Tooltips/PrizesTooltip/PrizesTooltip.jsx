/* global
  fetch
*/

/**
 * Prizes Tooltip Component.
 *
 * USAGE:
 * Wrap with <PrizesTooltip></PrizesTooltip> tags the element(s) which should
 * show the tooltip when hovered. Pass in the challenge details object via the
 * 'challenge' prop.
 */

import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import Tooltip from '../Tooltip';
import LoaderIcon from '../../../Loader/Loader';
import './PrizesTooltip.scss';

const ID_LENGTH = 6;

/**
 * A single bonus componenent.
 * It renders the bonus name inside a colored rectangle,
 * and the bonus number, formatted as currency, next to it.
 */
function Bonus(props) {
  return (
    <div styleName="bonus">
      <span styleName="bonus-name">{props.bonusName}</span>
      ${props.bonus.toLocaleString()}
    </div>
  );
}

Bonus.propTypes = {
  bonusName: PT.string.isRequired,
  bonus: PT.number.isRequired,
};

/**
 * A single prise component.
 * It renders a round-shaped medal with the specified place number inside it,
 * and the prize, formatted as currency, next to it.
 */
function Prize(props) {
  return (
    <div styleName="prize">
      <span styleName={`medal place-${props.place}`}>{props.place}</span>
      ${props.prize.toLocaleString()}
    </div>
  );
}

Prize.propTypes = {
  place: PT.number.isRequired,
  prize: PT.number.isRequired,
};

/**
 * Tooltip content.
 * It renders the list of prizes (using the Prize component), and, if reliability
 * bonus is associated with the challenge, it also renders it (using the Bonus component).
 */
function Tip(props) {
  let prizes;
  const isLoaded = props.isLoaded;
  if (isLoaded) {
    if (props.challenge.prize) {
      prizes = props.challenge.prize.map((prize, index) => {
        const place = 1 + index;
        return <Prize key={place} place={place} prize={prize} isLoaded={isLoaded} />;
      });
    }
  } else {
    return <div styleName="prizes-tooltip"><LoaderIcon type="small" /></div>;
  }
  let bonuses;
  if (props.challenge && props.challenge.reliabilityBonus) {
    bonuses = (
      <div styleName="bonuses">
        <h1>Bonuses</h1>
        <Bonus bonus={props.challenge.reliabilityBonus} bonusName="Reliability" />
      </div>
    );
  }
  return (
    <div styleName="prizes-tooltip">
      <div>
        <h1>Prizes</h1>
        {prizes}
      </div>
      {bonuses}
    </div>
  );
}

Tip.defaultProps = {
  isLoaded: false,
};

Tip.propTypes = {
  challenge: PT.shape({
    prize: PT.array,
    reliabilityBonus: PT.number,
  }).isRequired,
  isLoaded: PT.bool,
};

/**
 * Renders the tooltip.
 */

class PrizesTooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chDetails: {},
      isLoaded: false,
    };
    this.onTooltipHover = this.onTooltipHover.bind(this);
  }
  onTooltipHover() {
    const that = this;
    const chClone = _.clone(this.props.challenge);
    this.fetchChallengeDetails(chClone.challengeId).then((passedIndetails) => {
      const details = passedIndetails;
      const chId = `${chClone.challengeId}`;
      if (chId.length < ID_LENGTH) {
        details.postingDate = chClone.startDate;
        details.registrationEndDate = chClone.endDate;
        details.submissionEndDate = chClone.endDate;
        details.appealsEndDate = chClone.endDate;
      }
      that.setState({
        chDetails: details,
        isLoaded: true,
      });
    });
  }
  // It fetches detailed challenge data and attaches them to the 'details'
  // field of each challenge object.
  fetchChallengeDetails(id) {
    const challengeId = `${id}`; // change to string
    const baseUrl = this.props.config.API_URL_V2;
    const challengesApi = `${baseUrl}/challenges/`;
    const mmApi = `${baseUrl}/data/marathon/challenges/`; // MM - marathon match
    if (challengeId.length < ID_LENGTH) {
      return fetch(`${mmApi}${id}`).then(res => res.json());
    }
    return fetch(`${challengesApi}${id}`).then(res => res.json());
  }
  render() {
    const tip = <Tip challenge={this.state.chDetails} isLoaded={this.state.isLoaded} />;
    return (
      <Tooltip content={tip} onTooltipHover={this.onTooltipHover}>
        {this.props.children}
      </Tooltip>
    );
  }
}

PrizesTooltip.defaultProps = {
  challenge: {
    prize: [],
  },
  children: [],
  config: {
    API_URL_V2: '',
  },
};

PrizesTooltip.propTypes = {
  challenge: PT.shape({
    prize: PT.arrayOf(PT.number),
    reliabilityBonus: PT.number,
  }),
  children: PT.node.isRequired,
  config: PT.shape({
    API_URL_V2: PT.string,
  }),
};

export default PrizesTooltip;
