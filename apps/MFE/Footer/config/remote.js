const getFederationConfig = REMOTES => ({
  name: 'mfe_footer',
  filename: 'remote-entry.js',
  library: {type: 'commonjs'},
  remotes: REMOTES,
  exposes: {
    './footer': './src/Footer.tsx',
  },
  shared: ['react', 'react-dom'],
})

module.exports = {getFederationConfig}
