window.__ModuleLoader__.load({
  id: '@local/dsh-book-loom',
  factory(hostRequire) {
    globalThis.__BOOK_LOOM_REACT__ = hostRequire('react')
    const { createBookLoomPlugin } = require('./client-app.jsx')
    return createBookLoomPlugin()
  },
})
