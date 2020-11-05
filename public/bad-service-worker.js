// see: https://www.informit.com/articles/article.aspx?p=2999382&seqNum=4

self.addEventListener('install', event => {
  // fires when the browser installs the app
  // here we're just logging the event and the contents
  // of the object passed to the event. the purpose of this event
  // is to give the service worker a place to setup the local
  // environment after the installation completes.
  console.log(`SW: Event fired: ${event.type}`)
  console.dir(event)
})

self.addEventListener('activate', event => {
  // fires after the service worker completes its installation.
  // It's a place for the service worker to clean up from
  // previous service worker versions.
  console.log(`SW: Event fired: ${event.type}`)
  console.dir(event)
})

self.addEventListener('fetch', event => {
  // fires whenever the app requests a resource (file or data)
  console.log(`SW: Fetching ${event.request.url}`)
  // next, go get the requested resource from the network,
  // nothing fancy going on here.
  if (event.request.url.includes('favicon-32x32.png')) {
    console.log('SW: Replacing favicon-32x32.png with 404.png')
    event.respondWith(fetch(new Request('404.png')))
  }
})
