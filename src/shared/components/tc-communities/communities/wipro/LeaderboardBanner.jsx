import Banner from 'components/Contentful/Banner';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';

export default function ChallengeListingBanner() {
  return (
    <ContentfulLoader
      entryQueries={{
        content_type: 'banner',
        'fields.name': 'TopGear - Leaderboard - Banner',
      }}
      render={d => d.entries.matches[0].items
        .map(id => <Banner id={id} spaceName="topgear" />)}
      renderPlaceholder={LoadingIndicator}
      spaceName="topgear"
    />
  );
}
