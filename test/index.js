import VideoMeta from '../src'

const THROWAWAY_YT_KEY = 'AIzaSyAtwXUFOWMOzeY6nROYv6vfyz4OaYrWaR0'

let videoMeta = new VideoMeta({
    apiKeys: {
        youTube:        THROWAWAY_YT_KEY,
        dailyMotion:    null,
        vimeo:          null
    }
})

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
        console.log(data)
    }, err => {
        console.error(err)
    })
