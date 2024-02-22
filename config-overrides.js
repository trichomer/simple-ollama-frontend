module.exports = function override(config, env) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: require.resolve('path-browserify'),
      crypto: require.resolve('crypto-browserify'),
      os: require.resolve('os-browserify/browser'),
      stream: require.resolve('stream-browserify'),
    };
    return config;
  };  