const axios = require('axios')

const url = "https://api.flickr.com/services/rest/"
const defaultParams = {
    api_key: '00ac5f70d662304b87e7da585bbdef9d',
    method: 'flickr.photos.getRecent',
    per_page: 10,
    format: 'json',
    page: 1
}

const convertPhoto = photo => (
    {
        id: photo.id,
        title: photo.title,
        url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_t.jpg`
    }
)

const flickrApi = {
    get: params =>
        axios.get(url, {
            params: {...defaultParams, ...params}
        })
            .then(({data}) => {
                const photos = (JSON.parse(data.slice(14, -1))).photos
                return {...photos, photo: photos.photo.map(convertPhoto)}
            })
}

module.exports = flickrApi