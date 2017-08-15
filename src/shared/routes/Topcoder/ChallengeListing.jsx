/* TODO: Despite this code, the challenge-listing code is not splitted into
 * a separate chunk, because it is also used inside communities code, where
 * he is embed in such way, that codesplitting is not easy (we need to refactor
 * communities code to code-split it). */

import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import qs from 'qs';
import React from 'react';
import { SplitRoute } from 'utils/router';

export default function ChallengeListingRoute({
  listingOnly,
}) {
  return (
    <SplitRoute
      cacheCss
      chunkName="challenge-listing"
      exact
      path="/challenges"
      renderClientAsync={renderProps =>
        import(
          /* webpackChunkName: "challenge-listing" */
          'containers/challenge-listing/Listing',
        ).then(({ default: ChallengeListing }) => {
          const query = renderProps.location.search ?
            qs.parse(renderProps.location.search.slice(1)) : null;
          const currencyFromUrl = _.get(query, 'currency');
          const prizeMode = currencyFromUrl && `money-${currencyFromUrl}`;
          return (
            <ChallengeListing
              {...renderProps}
              listingOnly={listingOnly}
              prizeMode={prizeMode}
            />
          );
        })
      }
      renderPlaceholder={() => <LoadingIndicator />}
    />
  );
}

ChallengeListingRoute.defaultProps = {
  listingOnly: false,
};

ChallengeListingRoute.propTypes = {
  listingOnly: PT.bool,
};
