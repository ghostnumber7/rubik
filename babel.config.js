module.exports = function (api) {
  api.cache(true)
  // api.cache(false)

  return {
    plugins: [
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      '@babel/plugin-transform-runtime',
      '@babel/plugin-syntax-dynamic-import',
      'transform-react-remove-prop-types'
    ],
    presets: [
      [
        '@babel/preset-env', {
          loose: true,
          targets: {
            browsers: [
              '> 1%',
              'last 2 versions',
              'not ie <= 8'
            ]
          },
          // spec: true,
          useBuiltIns: 'usage',
          corejs: 3,
          // forceAllTransforms: true
        }
      ],
      '@babel/preset-react'
    ]
  }
}
