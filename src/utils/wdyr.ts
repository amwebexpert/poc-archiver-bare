import React from 'react';

if (__DEV__ || process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  console.log('whyDidYouRender LOADED');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
