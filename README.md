# :package: video-meta-from-url

Generalize parsing & async resolving content details for a video URL.  
Chainable syntax for Promises coming.

```
import VideoMeta ...

let videoMeta = new VideoMeta({ opts })

let links = [
        'https://www.dailymotion.com/video/x3qe6ik_hail-caesar-film-clip',
        'https://www.youtube.com/watch?v=FH_sQq89ILk',
        'https://vimeo.com/154096158'
    ].map(link => {
        let p = videoMeta.matchingProvider(link)

        return p.provider
            .fetchVideoMeta({
                videoId:    p.videoId
            })
    })

Promise
    .all(links)
    .then(data => {
        // data :: [ { id, title, description, duration } ... ]
    }, err => {
        console.error(err)
    })
```
