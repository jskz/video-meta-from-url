import fetch from 'isomorphic-fetch'
import moment from 'moment'

module.exports = function({ apiKeys }) {
    return {
        getDailyMotionMeta: function({ apiKey = apiKeys.dailyMotion, videoId }) {
            return new Promise((res, rej) => {
                fetch(
                    `//api.dailymotion.com/video/${videoId}?fields=id,title,duration,description`
                )
                .then(results => results.json())
                .then(data => {
                    try {
                        let parsed = {
                            id:             videoId,
                            title:          data.title,
                            duration:       data.duration * 1000,
                            description:    data.description
                        }

                        res(parsed)
                    } catch(err) {
                        rej(err)
                    }
                })
            })
        },

        getVimeoMeta: function({ apiKey = apiKeys.vimeo, videoId }) {
            return new Promise((res, rej) => {
                fetch(
                    `//vimeo.com/api/oembed.json?url=https%3A//vimeo.com/${videoId}`
                )
                .then(results => results.json())
                .then(data => {
                    try {
                        let parsed  = {
                            id:             videoId,
                            title:          data.title,
                            description:    data.description,
                            duration:       data.duration * 1000
                        }

                        res(parsed)
                    } catch(err) {
                        rej(err)
                    }
                })
            })
        },

        getYoutubeMeta: function({ apiKey = apiKeys.youTube, videoId }) {
            return new Promise((res, rej) =>
                fetch(
                    `//www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=contentDetails,snippet`
                )
                .then(results => results.json())
                .then(data => {
                    try {
                        let item    = data.items[0]
                        let parsed  = {
                            id:             videoId,
                            title:          item.snippet.title,
                            description:    item.snippet.description,
                            duration:       moment.duration(
                                item.contentDetails.duration
                            ).asMilliseconds()
                        }

                        res(parsed)
                    } catch(err) {
                        rej(err)
                    }
                })
            )
        },

        providerTypes: function() {
            return [
                {
                    name:           'DailyMotion',
                    shortName:      'dm',
                    test:           /dailymotion\.com\/video\/([^\/]+?)_/i,
                    idResult:       1,
                    fetchVideoMeta: this.getDailyMotionMeta
                },

                {
                    name:           'YouTube',
                    shortName:      'yt',
                    test:           /youtu(\.be|be\.com)\/watch\?v=([^\/]+?)\/?$/i,
                    idResult:       2,
                    fetchVideoMeta: this.getYoutubeMeta,
                },

                {
                    name:           'Vimeo',
                    shortName:      'vm',
                    test:           /vimeo\.com\/(\d+)$/i,
                    idResult:       1,
                    fetchVideoMeta: this.getVimeoMeta
                }
            ]
        },

        matchingProvider: function(url) {
            let usingProvider = {
                input: url
            }

            this.providerTypes()
                .forEach(provider => {
                    let re = new RegExp(provider.test),
                        res = null

                    if(null !== (res = re.exec(url))) {
                        usingProvider = {
                            provider:   provider,
                            videoId:    res[provider.idResult]
                        }
                    }
                })

            return usingProvider
        }
    }
}
